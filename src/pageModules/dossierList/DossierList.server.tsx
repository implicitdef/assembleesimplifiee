import { sql } from 'kysely'
import range from 'lodash/range'
import { GetServerSideProps } from 'next'
import { dbReleve } from '../../lib/dbReleve'
import {
  FIRST_LEGISLATURE_FOR_DOSSIERS,
  FIRST_LEGISLATURE_FOR_REUNIONS_AND_SESSIONS,
  LATEST_LEGISLATURE,
} from '../../lib/hardcodedData'
import * as types from './DossierList.types'
import sum from 'lodash/sum'
import sortBy from 'lodash/sortBy'
import * as dossierTypes from '../../lib/types/dossier'
import * as acteTypes from '../../lib/types/acte'

type Query = {
  legislature?: string
}

function extractActesConcret(
  actes: acteTypes.ActeLegislatif[] | null,
): acteTypes.ActeLegislatifConcret[] {
  function inner(
    acte: acteTypes.ActeLegislatif,
  ): acteTypes.ActeLegislatifConcret[] {
    if (acte.xsiType === 'Etape_Type') {
      return (acte.actesLegislatifs ?? []).flatMap(inner)
    }

    return [acte]
  }
  return (actes ?? []).flatMap(inner)
}

function determineCurrentStatus(
  actes: acteTypes.ActeLegislatif[] | null,
): string {
  const actesConcret = extractActesConcret(actes)
  if (actesConcret.some(_ => _.xsiType === 'Promulgation_Type')) {
    return 'Promulgué'
  }
  if (actesConcret.some(_ => _.xsiType === 'RetraitInitiative_Type')) {
    return 'Retiré'
  }
  if (
    actesConcret.some(
      _ =>
        _.xsiType === 'Decision_Type' &&
        _.statutConclusion?.famCode === 'TSORTF13',
    )
  ) {
    return 'Rejeté'
  }
  return '???'
}

function countActes(actes: acteTypes.ActeLegislatif[] | null) {
  function inner(acte: any) {
    const children = acte.actesLegislatifs ?? []
    const isLeaf = children.length === 0
    return isLeaf ? 1 : sum(children.map(inner))
  }
  return sum((actes ?? []).map(inner))
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
        destination: `/dossiers`,
      },
    }
  }
  const legislature = legislatureInPath ?? LATEST_LEGISLATURE
  const legislatureNavigationUrls = range(
    FIRST_LEGISLATURE_FOR_DOSSIERS,
    LATEST_LEGISLATURE + 1,
  ).map(l => {
    const tuple: [number, string] = [
      l,
      `/dossiers${l !== LATEST_LEGISLATURE ? `/${l}` : ''}`,
    ]
    return tuple
  })

  const dossiersWithActes = (
    await sql<{
      uid: string
      procedure: dossierTypes.Dossier['procedureParlementaire']['libelle']
      title: string
      actes: any[]
    }>`
SELECT 
  uid,
  data->'titreDossier'->>'titre' AS title,
  data->'procedureParlementaire'->>'libelle' AS procedure,
  data->'actesLegislatifs' AS actes
FROM dossiers
WHERE 
  data->>'legislature' = ${legislature.toString()}
ORDER BY title
  `.execute(dbReleve)
  ).rows

  // we count the nb of actes, this is probably temporary
  // just to get a quick idea of how big and important a dossier is
  const dossiers = sortBy(
    dossiersWithActes.map(d => {
      const { actes, ...rest } = d
      return {
        ...rest,
        nbReunions: extractActesConcret(
          actes as acteTypes.ActeLegislatif[] | null,
        ).filter(
          _ =>
            _.xsiType === 'DiscussionCommission_Type' ||
            _.xsiType === 'DiscussionSeancePublique_Type',
        ).length,
        status: determineCurrentStatus(
          actes as acteTypes.ActeLegislatif[] | null,
        ),
      }
    }),
    _ => -_.nbReunions,
  )

  return {
    props: {
      data: {
        legislature,
        legislatureNavigationUrls,
        dossiers,
      },
    },
  }
}
