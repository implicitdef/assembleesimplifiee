import { createTable, dropTable } from '../utils/utils'

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
    com_perm_fonction TEXT
)`
  await dropTable(tableName)
  await createTable(tableName, createTableSql)
}
