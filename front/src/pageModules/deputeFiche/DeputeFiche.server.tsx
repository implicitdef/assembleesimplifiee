import { sql } from 'kysely'
import mapValues from 'lodash/mapValues'
import { GetStaticPaths, GetStaticProps } from 'next'
import { dbReleve } from '../../lib/dbReleve'
import { LATEST_LEGISLATURE } from '../../lib/hardcodedData'
import { readLegislatureFromContext } from '../../lib/routingUtils'
import * as types from './DeputeFiche.types'
import max from 'lodash/max'

async function queryStats(
  uid: string,
  legislature: number,
): Promise<types.DeputeData['stats']> {
  const row = await dbReleve
    .selectFrom('nosdeputes_deputes_weekly_stats')
    .where('uid', '=', uid)
    .where('legislature', '=', legislature)
    .select('data')
    .executeTakeFirst()
  const statsRaw =
    (row?.data as types.WeeklyStats<types.StatsRawFromDb>) ?? null
  if (statsRaw) {
    return mapValues(statsRaw, raw => ({
      isVacances: raw.isVacances,
      presences: raw.nb_presences_commission + raw.nb_presences_hemicycle,
      mediane_presences: raw.mediane_presences_total,
    }))
  }
  return null
}

async function queryLegislatures(
  deputeUid: string,
): Promise<types.DeputeData['legislatures']> {
  return (
    await dbReleve
      .selectFrom('deputes_in_legislatures')
      .where('uid', '=', deputeUid)
      .select('legislature')
      .execute()
  ).map(_ => _.legislature)
}

async function queryMandats(
  deputeUid: string,
  legislature: number,
): Promise<types.Mandat[]> {
  return dbReleve
    .selectFrom('mandats_deputes')
    .where('depute_uid', '=', deputeUid)
    .where('legislature', '=', legislature)
    .select(['mandat_uid', 'date_debut', 'date_fin'])
    .execute()
}

export const getStaticPathsOlderLegislatures: GetStaticPaths<
  types.Params
> = async () => {
  const rows = await dbReleve
    .selectFrom('deputes_in_legislatures')
    .where('legislature', '!=', LATEST_LEGISLATURE)
    .where('slug', 'is not', null)
    .select('legislature')
    .select(sql<string>`slug`.as('slug'))
    .execute()
  return {
    paths: rows.map(_ => {
      const { slug, legislature } = _
      return {
        params: {
          slug,
          legislature: legislature.toString(),
        },
      }
    }),
    fallback: false,
  }
}

export const getStaticPathsLatestLegislatures: GetStaticPaths<
  types.Params
> = async () => {
  const rows = await dbReleve
    .selectFrom('deputes_in_legislatures')
    .where('legislature', '=', LATEST_LEGISLATURE)
    .where('slug', 'is not', null)
    .select(sql<string>`slug`.as('slug'))
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
  legislature: number,
): Promise<{ date_debut: string; date_fin: string | null }> {
  return dbReleve
    .selectFrom('legislatures')
    .where('legislature', '=', legislature)
    .select('date_debut')
    .select('date_fin')
    .executeTakeFirstOrThrow()
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

export const getStaticProps: GetStaticProps<
  types.Props,
  types.Params
> = async context => {
  if (!context.params) {
    throw new Error('Missing params')
  }
  const slug = context.params.slug
  const legislature = readLegislatureFromContext(context)

  const depute = await dbReleve
    .selectFrom('deputes_in_legislatures')
    .where('slug', '=', slug)
    .where('legislature', '=', legislature)
    .selectAll()
    .executeTakeFirst()
  if (!depute) {
    return {
      notFound: true,
    }
  }
  const legislatures = await queryLegislatures(depute.uid)
  const legislatureNavigationUrls = legislatures.map(l => {
    const tuple: [number, string] = [
      l,
      `/depute/${slug}${l !== LATEST_LEGISLATURE ? `/${l}` : ''}`,
    ]
    return tuple
  })

  const legislatureDates = await queryDatesLegislature(legislature)
  const mandats_this_legislature = await queryMandats(depute.uid, legislature)
  const stats = await queryStats(depute.uid, legislature)
  const nosDeputesUrl = getNosDeputesUrl(legislatures, slug)

  return {
    props: {
      legislature,
      legislatureNavigationUrls,
      deputeData: {
        depute,
        mandats_this_legislature,
        legislatures,
        stats,
        legislatureDates,
        nosDeputesUrl,
      },
    },
  }
}
