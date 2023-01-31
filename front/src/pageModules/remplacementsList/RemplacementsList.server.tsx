import sortBy from 'lodash/sortBy'
import { GetStaticPaths, GetStaticProps } from 'next'
import { dbReleve } from '../../lib/dbReleve'
import { FIRST_LEGISLATURE_FOR_DEPUTES } from '../../lib/hardcodedData'
import {
  buildLegislaturesNavigationUrls,
  buildStaticPaths,
  readLegislatureFromContext,
} from '../../lib/routingUtils'
import * as types from './RemplacementsList.types'

const basePath = '/historique-remplacements'
const firstLegislature = FIRST_LEGISLATURE_FOR_DEPUTES

export const getStaticPaths: GetStaticPaths<types.Params> = () => {
  return buildStaticPaths(firstLegislature)
}

export const getStaticProps: GetStaticProps<
  types.Props,
  types.Params
> = async context => {
  const legislature = readLegislatureFromContext(context)
  const legislatureNavigationUrls = buildLegislaturesNavigationUrls(
    firstLegislature,
    basePath,
  )

  const rows = (
    await dbReleve
      .selectFrom('mandats_by_circo')
      .where('legislature', '=', legislature)
      .where('nb_mandats', '>', 1)
      .select('data')
      .execute()
  ).map(_ => _.data as types.DerivedDeputesMandatsRawFromDb)

  const deputesIds = collectDeputesIds(rows)

  const deputes = deputesIds.length
    ? await dbReleve
        .selectFrom('deputes_in_legislatures')
        .where('legislature', '=', legislature)
        .where('uid', 'in', deputesIds)
        .selectAll()
        .execute()
    : []

  const rowsFinal: types.DerivedDeputesMandatsFinal[] = rows.map(row => {
    const { circo, mandats } = row
    return {
      circo,
      mandats: mandats.map(_ => {
        return _.map(mandat => {
          const {
            acteur_uid,
            cause_fin,
            date_debut_mandat,
            date_fin_mandat,
            full_name,
            suppleant_ref,
          } = mandat

          const depute = deputes.find(_ => _.uid === acteur_uid)
          if (!depute) {
            throw new Error(`Couldnt find depute ${acteur_uid} (${full_name})`)
          }

          return {
            depute,
            ...(cause_fin ? { cause_fin } : null),
            date_debut_mandat,
            date_fin_mandat,
            is_suppleant: !suppleant_ref,
          }
        })
      }),
    }
  })

  const rowsFinalSorted = sortBy(
    rowsFinal,
    _ => `${_.circo.num_dpt} - ${_.circo.num_circo}`,
  )

  return {
    props: {
      legislature,
      legislatureNavigationUrls,
      dataByCirco: rowsFinalSorted,
    },
  }
}

function collectDeputesIds(
  rows: types.DerivedDeputesMandatsRawFromDb[],
): string[] {
  return rows.flatMap(_ => _.mandats.flatMap(_ => _.map(_ => _.acteur_uid)))
}
