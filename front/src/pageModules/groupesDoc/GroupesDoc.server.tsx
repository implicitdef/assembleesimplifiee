import { GetStaticProps } from 'next'
import { dbReleve } from '../../lib/dbReleve'
import { LATEST_LEGISLATURE } from '../../lib/hardcodedData'
import * as types from './GroupesDoc.types'

export const getStaticProps: GetStaticProps<types.Props> = async context => {
  return {
    props: {
      groupeRN: await getGroupe('RN'),
      groupeECOLO: await getGroupe('ECOLO'),
      groupeLIOT: await getGroupe('LIOT'),
    },
  }
}

async function getGroupe(acronym: string): Promise<types.Groupe | null> {
  const row = await dbReleve
    .selectFrom('deputes_in_legislatures')
    .where('group_acronym', '=', acronym)
    .where('legislature', '=', LATEST_LEGISLATURE)
    .selectAll()
    .executeTakeFirst()
  if (!row || !row.group_acronym || !row.group_name || !row.group_color) {
    return null
  }
  return {
    acronym: row.group_acronym,
    nom: row.group_name,
    color: row.group_color,
  }
}
