import * as lo from 'lodash'
import { getDb } from '../../utils/db'
import {
  isMandatAssemblee,
  readAllDeputesAndMap,
} from '../../utils/readFromTricoteuses'
import { createTable, dropTable, toInt } from '../../utils/utils'

// Liste simplement tous les mandats de députés (une ligne par mandat)
// avec les dates de début/fin
// Un député peut donc avoir plusieurs lignes, même dans la même législature
export async function tricoteusesInsertTableMandatsDeputes() {
  const table = 'mandats_deputes'
  const createTableSql = `CREATE TABLE ${table} (
    mandat_uid TEXT PRIMARY KEY NOT NULL,
    legislature INTEGER NOT NULL,
    depute_uid TEXT NOT NULL,
    full_name TEXT NOT NULL,
    circo_dpt_name TEXT NOT NULL,
    circo_dpt_num TEXT NOT NULL,
    circo_num TEXT NOT NULL,
    date_debut TEXT NOT NULL,
    date_fin TEXT,
    UNIQUE (legislature, depute_uid, date_debut),
    UNIQUE (legislature, circo_dpt_num, circo_num, date_debut)
)`
  await dropTable(table)
  await createTable(table, createTableSql)

  const rows = readAllDeputesAndMap(deputeJson => {
    const { mandats } = deputeJson
    const mandatsAssemblee = mandats.filter(isMandatAssemblee)
    return mandatsAssemblee.map(mandat => {
      return {
        mandat_uid: mandat.uid,
        legislature: toInt(mandat.legislature),
        depute_uid: deputeJson.uid,
        full_name: `${deputeJson.etatCivil.ident.prenom} ${deputeJson.etatCivil.ident.nom}`,
        circo_dpt_name: mandat.election.lieu.departement,
        circo_dpt_num: mandat.election.lieu.numDepartement,
        circo_num: toInt(mandat.election.lieu.numCirco),
        date_debut: mandat.mandature.datePriseFonction ?? null,
        date_fin: mandat.dateFin ?? null,
      }
    })
  }).flat()

  console.log(`Found ${rows.length} rows to insert into ${table}`)
  for (const chunkOfRows of lo.chunk(rows, 1000)) {
    console.log(`Inserting a chunk of ${chunkOfRows.length}`)
    await getDb().insertInto(table).values(chunkOfRows).execute()
  }
  console.log('Done')
}
