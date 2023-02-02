import { getDb } from './utils/db'
import lo from 'lodash'

const additionalColors = {
  NI: '#8D949A',
}

// UMP => couleur proche de LR. Pas identique car il y a UMP et LR en même temps dans la legislature 14

// SER 14 => même chose que SOC ?? (n'est jamais en même temps que SOC)
// quelle était le groupe socialiste sous la 13 ? ptêt S.R.C mais il existait encore sous la 14 (SRC)

// SOC 12 => reprendre même couleur que SOC 15 (#D46CA9) ou SOC 16 (#DF84B5) ?

// S.R.C 13 ??
// et SRC 14 ?

// LES-REP 14 ??

// NI toujours mettre #8D949A    DONE

// GDR 13 et 14 mettre meme chose que 15 #A41914 ?

// UDI 14 ?

// UDF 12 ?

// NC 13 ?

// CR 12 ?

// RRDP 14 ?

// UDI-AGIR 15 ?

// NG 15 ?

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
