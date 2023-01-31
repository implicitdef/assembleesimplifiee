import path from 'path'
import { AM030 } from '../utils/tricoteusesDatasets'
import {
  createTable,
  dropTable,
  readFileAsJson,
  readFilesInSubdir,
  WORKDIR,
} from '../utils/utils'
import lo from 'lodash'
import { getDb, NosDeputesDatabase } from '../utils/db'
import { readAutoarchiveSlugs } from '../autoarchive/autoarchiveInsert'

export async function tricoteusesInsertTableDeputesInLegislature() {
  const tableName = 'deputes_in_legislatures'
  const createTableSql = `CREATE TABLE ${tableName} (
    uid TEXT NOT NULL,
    legislature INTEGER NOT NULL,
    UNIQUE (uid, legislature),
    slug TEXT,
    full_name TEXT NOT NULL,
    gender TEXT NOT NULL CHECK (gender IN ('M', 'F')),
    circo_dpt_name TEXT NOT NULL,
    circo_dpt_num TEXT NOT NULL,
    circo_num TEXT NOT NULL,
    group_acronym TEXT,
    group_fonction TEXT,
    group_color TEXT,
    com_perm TEXT,
    com_perm_fonction TEXT,
    date_fin TIMESTAMP WITH TIME ZONE
)`
  await dropTable(tableName)
  await createTable(tableName, createTableSql)

  const dir = path.join(WORKDIR, 'tricoteuses', AM030, 'acteurs')
  const filenames = readFilesInSubdir(dir)

  const slugs = await readAutoarchiveSlugs()

  const rows = filenames.flatMap(filename => {
    const deputeJson = readFileAsJson(path.join(dir, filename)) as ActeurJson

    const mandatsByLegislature = lo.groupBy(
      deputeJson.mandats.filter(isMandatAssemblee),
      _ => _.legislature,
    )
    if (Object.keys(mandatsByLegislature).length === 0) {
      // is not a depute
      return []
    }
    const lastMandatByLegislature = lo.mapValues(
      mandatsByLegislature,
      mandats => {
        // a depute can have multiple mandats in the same legislature.
        // This could cause confusion in the very unlikely case where he has mandats in different circos
        // Lets' pick the last one
        return lo.last(lo.sortBy(mandats, _ => _.dateFin))!
      },
    )
    const rows = Object.entries(lastMandatByLegislature).map(
      ([legislatureStr, lastMandat]) => {
        const gender = deputeJson.etatCivil.ident.civ === 'Mme' ? 'F' : 'M'
        const uid = deputeJson.uid
        const row: NosDeputesDatabase['deputes_in_legislatures'] = {
          legislature: toInt(legislatureStr),
          uid,
          slug: slugs.find(_ => _.uid === uid)?.slug ?? null,
          full_name: `${deputeJson.etatCivil.ident.prenom}_${deputeJson.etatCivil.ident.nom}`,
          gender,
          circo_dpt_name: lastMandat.election.lieu.departement,
          circo_dpt_num: lastMandat.election.lieu.numDepartement,
          circo_num: toInt(lastMandat.election.lieu.numCirco),
          date_fin: lastMandat.dateFin ?? null,
          group_acronym: null,
          group_fonction: null,
          group_color: null,
          com_perm: null,
          com_perm_fonction: null,
        }
        return row
      },
    )

    // TODO for each rows, fetch other fields (group etc.)
    return rows
  })

  console.log(`Inserting ${rows.length} rows`)

  await getDb().insertInto(tableName).values(rows).execute()
}

type ActeurJson = {
  uid: string
  etatCivil: {
    ident: { civ: 'M.' | 'Mme'; nom: string; prenom: string }
  }
  mandats: Mandat[]
  // there are other fields
}

type Mandat =
  | MandatDepute
  | {
      typeOrgane: '__other__' // there a bunch of possible values
    }

type MandatDepute = {
  typeOrgane: 'ASSEMBLEE'
  legislature: string
  election: {
    lieu: {
      departement: string
      numDepartement: string
      numCirco: string
    }
  }
  dateFin?: string
}

function isMandatAssemblee(mandat: Mandat): mandat is MandatDepute {
  return mandat.typeOrgane === 'ASSEMBLEE'
}

function toInt(s: string) {
  return parseInt(s, 10)
}
