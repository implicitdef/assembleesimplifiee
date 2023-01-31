import { getDb } from '../utils/db'
import { readAllAssemblees } from '../utils/readFromTricoteuses'
import { createTable, dropTable, toInt } from '../utils/utils'

export async function tricoteusesInsertTableLegislatures() {
  const table = 'legislatures'
  const createTableSql = `CREATE TABLE ${table} (
    organe_uid TEXT PRIMARY KEY NOT NULL,
    legislature INTEGER NOT NULL,
    date_debut TEXT NOT NULL,
    date_fin TEXT,
    UNIQUE (legislature),
    UNIQUE (date_debut)
)`
  await dropTable(table)
  await createTable(table, createTableSql)

  const rows = readAllAssemblees().map(assemblee => {
    return {
      organe_uid: assemblee.uid,
      legislature: toInt(assemblee.legislature),
      date_debut: assemblee.viMoDe.dateDebut,
      date_fin: assemblee.viMoDe.dateFin ?? null,
    }
  })

  console.log(`Found ${rows.length} rows to insert into ${table}`)
  await getDb().insertInto(table).values(rows).execute()
  console.log('Done')
}
