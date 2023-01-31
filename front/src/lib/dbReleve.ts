import { Kysely, PostgresDialect } from 'kysely'
import { Pool } from 'pg'
import { Adresses } from '../pageModules/deputeFiche/DeputeFiche.types'
import { readFromEnv, readIntFromEnv } from './utils'

console.log('Starting releve DB connection pool')
export const dbReleve = new Kysely<ReleveTables>({
  dialect: new PostgresDialect({
    pool: new Pool({
      host: readFromEnv('DB_RELEVE_HOST'),
      port: readIntFromEnv('DB_RELEVE_PORT'),
      user: readFromEnv('DB_RELEVE_USER'),
      password: readFromEnv('DB_RELEVE_PWD'),
      database: readFromEnv('DB_RELEVE_NAME'),
    }),
  }),
  log: ['query'],
})

export interface ReleveTables {
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
  dossiers: {
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
  reunions: {
    uid: string
    data: unknown
    legislature: number
    path_in_dataset: string
  }
  sessions: {
    uid: string
    ordinaire: boolean
    legislature: number
    start_date: Date
    end_date: Date
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
