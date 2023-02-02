import { getDb } from './utils/db'
import lo from 'lodash'

export const hardcodedAdditionalColors: {
  [k: string]: string | [number, string][]
} = {
  // non inscrits
  NI: '#8D949A',

  // Groupe socialiste principal
  SOC: '#D46CA9', // in 12, same as SOC in 15
  SER: '#D46CA9', // in 14, same as SOC in 15
  'S.R.C.': '#D46CA9', // in 13, same as SOC in 15
  SRC: '#a6678c', // in 14, there is a bit of overlap with SER so we darken S.R.C.
  NG: '#785067', // in 15. Wiki says it was transformed into SOC during 15. So we use same as SOC but darken a bit.

  // Groupe de droite principal
  'LES-REP': '#1C2EFA', // in 14, same as LR in 15
  UMP: [
    // same as LR in 14
    [12, '#1C2EFA'],
    [13, '#1C2EFA'],
    // but in 14 there is a bit of overlap, so we darken UMP
    [14, '#414CBF'],
  ],

  // Centre gauche
  RRDP: '#fac384', // in 13. We take this yellow from nosdeputes and their logo

  // communistes
  GDR: '#A41914', // 13 and 14, same as in 15

  // centre droit, jean louis borloo
  UDI: '#94B7E1', // 14, same as UDI-I in 15
  'UDI-AGIR': '#46678f', // 15. Overlap with UDI-I, so we darken it

  // Nouveau Centre. centre droit, allié de sarkozy
  NC: '#1eb4ff', // 13. Light blue from nosdeputes

  UDF: '#F26D22', // 12. Same in DEM/MODEM in 15

  // TODO CR 12
}

// TODO
// CR 12 ? ??

export async function sandbox() {
  console.log('@@@ sandbox')

  const rows = await getDb()
    .selectFrom('deputes_in_legislatures')
    .selectAll()
    .execute()

  const groups = lo.sortBy(
    Object.entries(
      lo.mapValues(
        lo.groupBy(
          rows.filter(_ => _.group_acronym),
          _ => _.group_acronym,
        ),
        _ => {
          const rowsByLegislature = lo.groupBy(_, _ => _.legislature)
          const infosByLegislature = lo.mapValues(rowsByLegislature, _ => {
            const nbMembers = _.length
            const color = _[0].group_color
            return { nbMembers, color }
          })

          return infosByLegislature
        },
      ),
    ),
    _ => lo.sum(Object.values(_[1]).map(_ => _.nbMembers)),
  )

  groups.forEach(group => {
    console.log(group)
  })
  return Promise.resolve()
}
