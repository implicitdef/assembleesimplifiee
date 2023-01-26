import { sql } from 'kysely'
import range from 'lodash/range'
import sortBy from 'lodash/sortBy'
import { GetStaticPaths, GetStaticProps } from 'next'
import {
  addLatestGroupToDeputes,
  latestGroupIsNotNull,
} from '../../lib/addLatestGroup'
import { buildGroupesData } from '../../lib/buildGroupesData'
import { dbReleve } from '../../lib/dbReleve'
import {
  FIRST_LEGISLATURE_FOR_DEPUTES,
  LATEST_LEGISLATURE,
  sortGroupes,
} from '../../lib/hardcodedData'
import * as types from './DeputeList.types'

// two ways to access this page :
// /deputes
// /deputes/15
type Params = {
  legislature?: string
}

export const getStaticPaths: GetStaticPaths<Params> = () => {
  return {
    paths: [
      { params: { legislature: '15' } },
      { params: { legislature: '14' } },
    ],
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps<
  types.Props,
  Params
> = async context => {
  const params = context.params
  const legislatureInPath = params?.legislature
    ? parseInt(params.legislature, 10)
    : null
  if (legislatureInPath === LATEST_LEGISLATURE) {
    return {
      redirect: {
        permanent: false,
        destination: `/deputes`,
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
      `/deputes${l !== LATEST_LEGISLATURE ? `/${l}` : ''}`,
    ]
    return tuple
  })

  const deputesRaw = (
    await sql<types.DeputeRawFromDb>`
    SELECT DISTINCT ON (acteur_uid)
    acteurs.uid,
    nosdeputes_deputes.slug,
    acteurs.data->'etatCivil'->'ident'->>'prenom' AS first_name,
    acteurs.data->'etatCivil'->'ident'->>'nom' AS last_name,
    mandats.data->'election'->'lieu'->>'departement' AS circo_departement,
    CASE
    	WHEN mandats.data->>'dateFin' IS NULL THEN TRUE
    	WHEN organes.data->'viMoDe'->>'dateFin' IS NULL THEN FALSE
    	WHEN mandats.data->>'dateFin' < organes.data->'viMoDe'->>'dateFin' THEN FALSE
      ELSE TRUE
	  END AS mandat_ongoing
  FROM acteurs
  INNER JOIN mandats ON acteurs.uid = mandats.acteur_uid
  INNER JOIN organes ON organes.uid = ANY(mandats.organes_uids)
  LEFT JOIN nosdeputes_deputes ON nosdeputes_deputes.uid = acteurs.uid
  WHERE
    organes.data->>'codeType' = 'ASSEMBLEE'
    AND organes.data->>'legislature' = ${legislature.toString()}
  `.execute(dbReleve)
  ).rows

  const deputes: types.DeputeSimple[] = sortBy(
    deputesRaw,
    // this sort can't be done in the SQL
    // incompatible with our DISTINCT clause
    _ => _.last_name,
  ).map(depute => {
    const { first_name, last_name, ...rest } = depute
    return {
      fullName: `${first_name} ${last_name}`,
      firstLetterLastName: last_name[0] ?? 'z',
      ...rest,
    }
  })

  const deputesWithGroup = await addLatestGroupToDeputes(deputes, legislature)
  const groupesData = sortGroupes(
    buildGroupesData(
      deputesWithGroup
        .filter(_ => _.mandat_ongoing)
        .filter(latestGroupIsNotNull),
    ),
  )
  return {
    props: {
      legislature,
      legislatureNavigationUrls,
      deputes: deputesWithGroup,
      groupesData,
    },
  }
}
