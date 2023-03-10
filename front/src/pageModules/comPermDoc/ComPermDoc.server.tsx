import sum from 'lodash/sum'
import { GetStaticProps } from 'next'
import { dbReleve } from '../../lib/dbReleve'
import { ComPermAcronym, LATEST_LEGISLATURE } from '../../lib/hardcodedData'
import * as types from './ComPermDoc.types'

export const getStaticProps: GetStaticProps<types.Props> = async context => {
  const groupesDataHemicycle = await getGroupesData()
  const groupesDataComFin = await getGroupesData('CION_FIN')
  const groupesDataComLois = await getGroupesData('CION_LOIS')

  return {
    props: {
      groupesDataHemicycle,
      groupesDataComFin,
      groupesDataComLois,
    },
  }
}

async function getGroupesData(
  comPermName?: ComPermAcronym,
): Promise<types.Repartition> {
  const q1 = dbReleve
    .selectFrom('deputes_in_legislatures')
    .where('legislature', '=', LATEST_LEGISLATURE)
    .where('ongoing', '=', true)
    .where('group_acronym', 'is not', null)
  const q2 = comPermName ? q1.where('com_perm_name', '=', comPermName) : q1
  const q3 = q2
    .groupBy(['group_acronym', 'group_color'])
    .select(['group_acronym', 'group_color'])
    .select(dbReleve.fn.count<string>('uid').as('nb_deputes'))
    .orderBy('group_acronym')
  const rows = await q3.execute()

  const rowsWithNumber = rows.map(({ nb_deputes, ...row }) => ({
    ...row,
    nb_deputes: parseInt(nb_deputes, 10),
  }))

  const nbTotal = sum(rowsWithNumber.map(_ => _.nb_deputes))
  return {
    total: nbTotal,
    groupes: rowsWithNumber.map(row => {
      const { group_acronym, group_color, nb_deputes } = row
      if (!group_acronym || !group_color) {
        throw new Error(`Selected deputes with no group, should not happen`)
      }
      return {
        acronym: group_acronym,
        color: group_color,
        deputesShareOfTotal: nb_deputes / nbTotal,
        nbDeputes: nb_deputes,
      }
    }),
  }
}
