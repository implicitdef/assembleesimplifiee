import { Kysely, PostgresDialect } from 'kysely'
import { readFromEnv, readIntFromEnv } from './utils'
import { Pool } from 'pg'
import { Adresses } from './rewriteAdresses'

let pool: Kysely<NosDeputesDatabase> | null = null

export function getDb(): Kysely<NosDeputesDatabase> {
  if (!pool) {
    console.log('Starting DB connection pool')
    pool = new Kysely<NosDeputesDatabase>({
      dialect: new PostgresDialect({
        pool: new Pool({
          //min: 0,
          host: readFromEnv('DB_HOST'),
          port: readIntFromEnv('DB_PORT'),
          user: readFromEnv('DB_USER'),
          password: readFromEnv('DB_PWD'),
          database: readFromEnv('DB_NAME'),
        }),
      }),
      // log: ['query'],
    })
  }
  return pool
}

export interface NosDeputesDatabase {
  acteurs: {
    uid: string
    data: unknown
    adresses: Adresses
  }
  organes: {
    uid: string
    data: unknown
  }
  mandats: {
    uid: string
    data: unknown
    acteur_uid: string
    organes_uids: string[]
  }
  reunions: {
    uid: string
    data: unknown
    path_in_dataset: string
  }
  sessions: {
    uid: string
    legislature: number
    start_date: Date
    end_date: Date
  }
  dossiers: {
    uid: string
    data: unknown
  }
  dossiers_simplified: {
    uid: string
    data: unknown
  }
  scrutins: {
    uid: string
    data: unknown
  }
  comptesrendus: {
    uid: string
    data: unknown
  }
  nosdeputes_deputes: {
    uid: string
    slug: string
  }
  nosdeputes_deputes_weekly_stats: {
    uid: string
    legislature: number
    data: unknown
  }
  derived_deputes_mandats: {
    legislature: number
    circo_uid: string
    nb_mandats: number
    data: unknown
  }
  deputes_in_legislatures: {
    uid: string
    legislature: number
    slug: string | null
    full_name: string
    gender: 'F' | 'M'
    circo_dpt_name: string
    circo_dpt_num: string
    circo_num: number
    group_uid: string | null
    group_acronym: string | null
    group_fonction: string | null
    group_color: string | null
    com_perm_uid: string | null
    com_perm_name: string | null
    com_perm_fonction: string | null
    date_fin: string | null
  }
}

export async function releaseDb() {
  if (pool) {
    console.log('Releasing DB connection pool')
    await pool.destroy()
  }
}
