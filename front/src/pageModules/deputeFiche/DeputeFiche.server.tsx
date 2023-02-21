import { sql } from 'kysely'
import mapValues from 'lodash/mapValues'
import max from 'lodash/max'
import { GetStaticPaths, GetStaticProps } from 'next'
import { dbReleve, ReleveTables } from '../../lib/dbReleve'
import { LATEST_LEGISLATURE } from '../../lib/hardcodedData'
import * as types from './DeputeFiche.types'

export const getStaticProps: GetStaticProps<
  types.Props,
  types.Params
> = async context => {
  if (!context.params) {
    throw new Error('Missing params')
  }
  const slug = context.params.slug

  const deputeEachLegislature = await dbReleve
    .selectFrom('deputes_in_legislatures')
    .where('slug', '=', slug)
    .selectAll()
    .execute()
  if (!deputeEachLegislature.length) {
    return {
      notFound: true,
    }
  }
  const uid = deputeEachLegislature[0].uid
  const legislatures = deputeEachLegislature.map(_ => _.legislature)

  const legislatureDates = await queryDatesLegislature(legislatures)
  const mandats = await queryMandats(uid)
  const stats = await queryStats(uid)
  const nosDeputesUrl = getNosDeputesUrl(legislatures, slug)

  const dataInLegislatures = prepareAllDataByLegislature(
    legislatures,
    deputeEachLegislature,
    legislatureDates,
    mandats,
    stats,
  )

  return {
    props: {
      deputeData: {
        nosDeputesUrl,
        dataInLegislatures,
      },
    },
  }
}

function prepareAllDataByLegislature(
  legislatures: number[],
  deputeEachLegislature: types.Depute[],
  legislaturesDates: ReleveTables['legislatures'][],
  mandats: types.Mandat[],
  stats: [number, types.WeeklyStats<types.StatsFinal> | null][],
): types.DeputeData['dataInLegislatures'] {
  return legislatures.map(legislature => {
    const depute = deputeEachLegislature.find(
      _ => _.legislature === legislature,
    )
    if (!depute) {
      throw new Error(
        `Didn't find the depute row for the legislature ${legislature}`,
      )
    }
    const mandatsThisLegislature = mandats.filter(
      _ => _.legislature === legislature,
    )
    const legislatureDates = legislaturesDates.find(
      _ => _.legislature === legislature,
    )
    if (!legislatureDates) {
      throw new Error(`Didn't find the dates of the legislature ${legislature}`)
    }
    const statsThisLegislature =
      stats.find(_ => _[0] === legislature)?.[1] ?? null

    const data: types.DeputeDataForLegislature = {
      depute,
      mandats: mandatsThisLegislature,
      stats: statsThisLegislature,
      legislatureDates,
    }
    return [legislature, data]
  })
}

async function queryStats(
  uid: string,
): Promise<[number, types.WeeklyStats<types.StatsFinal> | null][]> {
  const rows = await dbReleve
    .selectFrom('nosdeputes_deputes_weekly_stats')
    .where('uid', '=', uid)
    .selectAll()
    .execute()

  return rows.map(row => {
    const legislature = row.legislature
    const statsRaw = row.data as types.WeeklyStats<types.StatsRawFromDb>

    const statsFinal = mapValues(statsRaw, raw => ({
      isVacances: raw.isVacances,
      presences: raw.nb_presences_commission + raw.nb_presences_hemicycle,
      mediane_presences: raw.mediane_presences_total,
    }))
    return [legislature, statsFinal]
  })
}

async function queryMandats(deputeUid: string): Promise<types.Mandat[]> {
  return dbReleve
    .selectFrom('mandats_deputes')
    .where('depute_uid', '=', deputeUid)
    .select(['mandat_uid', 'date_debut', 'date_fin', 'legislature'])
    .execute()
}

export const getStaticPaths: GetStaticPaths<types.Params> = async () => {
  const rows = await dbReleve
    .selectFrom('deputes_in_legislatures')
    .where('slug', 'is not', null)
    .select(sql<string>`slug`.as('slug'))
    .distinct()
    .execute()
  return {
    paths: rows.map(_ => {
      const { slug } = _
      return {
        params: {
          slug,
        },
      }
    }),
    fallback: false,
  }
}

function queryDatesLegislature(
  legislatures: number[],
): Promise<ReleveTables['legislatures'][]> {
  return dbReleve
    .selectFrom('legislatures')
    .where('legislature', 'in', legislatures)
    .selectAll()
    .execute()
}

function getNosDeputesUrl(
  legislaturesOfDepute: number[],
  slug: string,
): string | null {
  const nosDeputesLegislatures = [
    [16, 'www.nosdeputes.fr'],
    [15, '2017-2022.nosdeputes.fr'],
    [14, '2012-2017.nosdeputes.fr'],
    [13, '2007-2012.nosdeputes.fr'],
  ] as const
  // on link toujours vers la dernière législature disponible pour ce député
  const latestLegislature = max(legislaturesOfDepute)
  const domain = nosDeputesLegislatures.find(
    _ => _[0] === latestLegislature,
  )?.[1]
  if (domain) {
    return `https://${domain}/${slug}`
  }
  return null
}
