import { sql } from 'kysely'
import range from 'lodash/range'
import sortBy from 'lodash/sortBy'
import { GetServerSideProps } from 'next'
import { dbReleve } from '../../lib/dbReleve'
import {
  FIRST_LEGISLATURE_FOR_DEPUTES,
  LATEST_LEGISLATURE,
} from '../../lib/hardcodedData'
import { addLatestGroupToDeputes } from '../../lib/addLatestGroup'
import * as types from './MandatsParCirco.types'

type Query = {
  legislature?: string
}

function collectDeputesIds(
  rows: types.DerivedDeputesMandatsRawFromDb[],
): string[] {
  return rows.flatMap(_ => _.mandats.flatMap(_ => _.map(_ => _.acteur_uid)))
}

export const getServerSideProps: GetServerSideProps<{
  data: types.Props
}> = async context => {
  const query = context.query as Query
  const legislatureInPath = query.legislature
    ? parseInt(query.legislature, 10)
    : null
  if (legislatureInPath === LATEST_LEGISLATURE) {
    return {
      redirect: {
        permanent: false,
        destination: `/mandats-par-circonscription`,
      },
    }
  }
  const legislature = legislatureInPath ?? LATEST_LEGISLATURE
  const legislatureNavigationUrls = range(
    FIRST_LEGISLATURE_FOR_DEPUTES,
    LATEST_LEGISLATURE + 1,
  ).map(l => {
    const tuple: [number, string] = [
      l,
      `/mandats-par-circonscription${l !== LATEST_LEGISLATURE ? `/${l}` : ''}`,
    ]
    return tuple
  })

  const rows = (
    await dbReleve
      .selectFrom('derived_deputes_mandats')
      .where('legislature', '=', legislature)
      .where('nb_mandats', '>', 1)
      .select('data')
      .execute()
  ).map(_ => _.data as types.DerivedDeputesMandatsRawFromDb)

  const deputesIds = collectDeputesIds(rows)

  const deputes = (
    deputesIds.length
      ? (
          await sql<{
            uid: string
            full_name: string
            gender: 'M' | 'F'
          }>`
SELECT
  uid, 
  CONCAT (
    data->'etatCivil'->'ident'->>'prenom',
    ' ',
    data->'etatCivil'->'ident'->>'nom'
  ) AS full_name,
  CASE
    WHEN acteurs.data->'etatCivil'->'ident'->>'civ' = 'M.' THEN 'H'
    ELSE 'F'
  END as gender
FROM acteurs
WHERE uid IN (${sql.join(deputesIds)})
`.execute(dbReleve)
        ).rows
      : []
  ).map(_ => {
    const { full_name, ...rest } = _
    return {
      ...rest,
      fullName: full_name,
    }
  })

  const deputesWithLatestGroup = await addLatestGroupToDeputes(
    deputes,
    legislature,
  )

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

          const depute = deputesWithLatestGroup.find(_ => _.uid === acteur_uid)
          if (!depute) {
            throw new Error(`Couldnt find depute ${acteur_uid} (${full_name})`)
          }

          return {
            depute: {
              ...depute,
              circo_departement: circo.name_dpt,
              slug: 'TODO_do_the_slug',
              mandat_ongoing: true, // pas besoin d'afficher cette notion ici
            },
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
      data: {
        legislature,
        legislatureNavigationUrls,
        dataByCirco: rowsFinalSorted,
      },
    },
  }
}
