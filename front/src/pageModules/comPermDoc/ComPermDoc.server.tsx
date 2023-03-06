import { GetStaticProps } from 'next'
import { dbReleve } from '../../lib/dbReleve'
import { LATEST_LEGISLATURE } from '../../lib/hardcodedData'
import * as types from './ComPermDoc.types'

export const getStaticProps: GetStaticProps<types.Props> = async context => {
  const groupes = await getAllGroupes()

  return {
    props: {
      groupes,
    },
  }
}

async function getAllGroupes(): Promise<types.Groupe[]> {
  const rows = (
    await dbReleve
      .selectFrom('deputes_in_legislatures')
      .where('legislature', '=', LATEST_LEGISLATURE)
      .where('group_acronym', 'is not', null)
      .groupBy(['group_acronym', 'group_color', 'group_name', 'group_pos'])
      .select(['group_acronym', 'group_color', 'group_name', 'group_pos'])
      .select(dbReleve.fn.count<number>('uid').as('nb_deputes'))
      .execute()
  ).filter(_ => _.nb_deputes > 0)
  return rows.map(row => {
    const { group_acronym, group_color, group_name, group_pos, nb_deputes } =
      row
    if (!group_acronym || !group_color || !group_name) {
      throw new Error(
        `Missing values for a group ${JSON.stringify({
          group_acronym,
          group_color,
          group_name,
          group_pos,
          nb_deputes,
        })}`,
      )
    }
    return { group_acronym, group_color, group_name, group_pos, nb_deputes }
  })
}
