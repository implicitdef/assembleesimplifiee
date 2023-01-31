import * as dotenv from 'dotenv'
import { parseAndCheckArgs as parseAndCheckArguments } from './utils/cli'
import { tricoteusesClone } from './tricoteuses/tricoteusesClone'
import { releaseDb } from './utils/db'
import { tricoteusesInsert } from './tricoteuses/tricoteusesInsert'
import { sandbox } from './sandbox'
import { autoarchiveClone } from './autoarchive/autoarchiveClone'
import { autoarchiveInsert } from './autoarchive/autoarchiveInsert'
import { anFetch } from './an/anFetch'
import { anInsert } from './an/anInsert'
import { reshapeDossiers } from './derived/reshapeDossiers/reshapeDossiers'
import { tricoteusesInsertTableMandatsByCirco } from './tricoteuses/newtables/tricoteusesInsertTableMandatsByCirco'
import { tricoteusesInsertTableDeputesInLegislature } from './tricoteuses/newtables/tricoteusesInsertTableDeputesInLegislature'
import { createTables } from './createtables'
import { tricoteusesInsertTableMandatsDeputes } from './tricoteuses/newtables/tricoteusesInsertTableMandatsDeputes'

async function start() {
  const args = parseAndCheckArguments()
  dotenv.config({ path: './.env.local' })
  if (args) {
    if (args.createTables) {
      console.log('--- Creating SQL tables')
      await createTables(args)
    }
    if (args.tricoteusesClone) {
      console.log('--- Cloning datasets from Les Tricoteuses')
      tricoteusesClone()
    }
    if (args.tricoteusesInsert) {
      console.log(
        '--- Inserting data from Les Tricoteuses datasets into the tables',
      )
      await tricoteusesInsert(args)
    }
    if (args.autoarchiveClone) {
      console.log('--- Cloning data from the "auto archive"')
      await autoarchiveClone()
    }
    if (args.autoarchiveInsert) {
      console.log('--- Inserting data from the "auto archive" into the tables')
      await autoarchiveInsert()
    }
    if (args.anFetch) {
      console.log('--- Downloading data from AN open data')
      await anFetch(args)
    }
    if (args.anInsert) {
      console.log('--- Inserting some data from AN open data into the tables')
      await anInsert(args)
    }
    if (args.sandbox) {
      console.log('--- Sandbox')
      await sandbox(args)
      await tricoteusesInsertTableDeputesInLegislature()
      await tricoteusesInsertTableMandatsDeputes()
      await tricoteusesInsertTableMandatsByCirco()
    }
    if (args.derivedInsert) {
      console.log('--- Insert derived data')
      await reshapeDossiers()
    }
    await releaseDb()
  }
  console.log('-- All done')
}

void start()
