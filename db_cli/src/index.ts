import * as dotenv from 'dotenv'
import { autoarchiveClone } from './fetchAndClone/autoarchiveClone'
import { tricoteusesClone } from './fetchAndClone/tricoteusesClone'
import { autoarchiveInsert } from './newtables/autoarchiveInsert'
import { tricoteusesInsertTableDeputesInLegislature } from './newtables/tricoteusesInsertTableDeputesInLegislature'
import { tricoteusesInsertTableLegislatures } from './newtables/tricoteusesInsertTableLegislatures'
import { tricoteusesInsertTableMandatsByCirco } from './newtables/tricoteusesInsertTableMandatsByCirco'
import { tricoteusesInsertTableMandatsDeputes } from './newtables/tricoteusesInsertTableMandatsDeputes'
import { anFetch } from './oldtables/an/anFetch'
import { anInsert } from './oldtables/an/anInsert'
import { createOldTables } from './oldtables/createOldTables'
import { reshapeDossiers } from './oldtables/derived/reshapeDossiers/reshapeDossiers'
import { tricoteusesInsert } from './oldtables/tricoteuses/tricoteusesInsert'
import { sandbox } from './sandbox'
import { parseAndCheckArgs as parseAndCheckArguments } from './utils/cli'
import { releaseDb } from './utils/db'

async function start() {
  const args = parseAndCheckArguments()
  dotenv.config({ path: './.env.local' })
  if (args) {
    if (args.fetchData) {
      console.log('--- Cloning datasets from Les Tricoteuses')
      tricoteusesClone()
      console.log('--- Cloning data from the "auto archive"')
      await autoarchiveClone()
    }
    if (args.insertData) {
      console.log('--- Creating and populating the tables')
      await autoarchiveInsert()
      await tricoteusesInsertTableLegislatures()
      await tricoteusesInsertTableDeputesInLegislature()
      await tricoteusesInsertTableMandatsDeputes()
      await tricoteusesInsertTableMandatsByCirco()
    }
    if (args.doOldTables) {
      await createOldTables(args)
      await anFetch(args)
      await anInsert(args)
      await tricoteusesInsert(args)
      await reshapeDossiers()
    }
    if (args.sandbox) {
      await sandbox()
    }
    await releaseDb()
  }
  console.log('-- All done')
}

void start()
