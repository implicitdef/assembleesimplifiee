import commandLineArgs, { CommandLineOptions } from 'command-line-args'
import commandLineUsage, { Section, OptionDefinition } from 'command-line-usage'

export type CliArgs = {
  createTables: boolean
  tricoteusesClone: boolean
  tricoteusesInsert: boolean
  sandbox: boolean
  autoarchiveClone: boolean
  autoarchiveInsert: boolean
  anFetch: boolean
  anInsert: boolean
  derivedInsert: boolean
}

const optionDefinitions: OptionDefinition[] = [
  {
    name: 'createTables',
    type: Boolean,
    description:
      'Create all the tables in the DB. If already present, they will be overriden, existing data will be lost.',
  },
  {
    name: 'tricoteusesClone',
    type: Boolean,
    description:
      'Clone the latest datasets from Tricoteuses in the work directory. If already present, they will be overridden.',
  },
  {
    name: 'tricoteusesInsert',
    type: Boolean,
    description:
      'Inserts the content of the Tricoteuses datasets into the tables. Assumes the datasets and tables are present. Deletes existing data in each table before inserting.',
  },
  {
    name: 'autoarchiveClone',
    type: Boolean,
    description:
      'Clone the repo "auto_archive_deputes_data" (which takes its data from NosDeputes) in the work directory. If already present, it will be overridden.',
  },
  {
    name: 'autoarchiveInsert',
    type: Boolean,
    description:
      'Inserts the content from "auto_archive_deputes_data" into the tables. Assumes the data and tables are present. Deletes existing data in each table before inserting.',
  },
  {
    name: 'anFetch',
    type: Boolean,
    description: 'Fetch some data directly from the AN open data',
  },
  {
    name: 'anInsert',
    type: Boolean,
    description:
      'Inserts the content of the datasets from AN open data datasets into the tables. Assumes the datasets and tables are present. Deletes existing data in each table before inserting.',
  },
  {
    name: 'derivedInsert',
    type: Boolean,
    description:
      'Inserts data in some tables based on some other tables. Has to be run last',
  },
  {
    name: 'all',
    type: Boolean,
    description: 'Run the full process, resetting the DB from scratch',
  },
  {
    name: 'sandbox',
    type: Boolean,
    description: 'Temporary command to explore some JSONs',
  },
  {
    name: 'help',
    type: Boolean,
    description: 'Display this help',
  },
]
const sections: Section[] = [
  {
    header: 'The "Releve DB" script',
    content: [
      'Script to build a new Postgres DB, injecting data from multiple sources (Tricoteuses + NosDeputes)',
      'By default the script does nothing, you have to activate each step (with --createTables for example).',
      'If you just want to create the whole DB from scratch, you probably want to do {bold yarn start --all}',
    ],
  },
  {
    header: 'Examples',
    content: [
      '{italic Display this help}',
      '$ yarn start {bold --help}',
      '{italic Creates the SQL tables}',
      '$ yarn start {bold --createTables}',
      '{italic Clone the Tricoteuses datasets into ./tmp}',
      '$ yarn start {bold --tricoteusesClone}',
      '{italic Read the Tricoteuses datasets from ./tmp and insert into the tables}',
      '$ yarn start {bold --tricoteusesInsert}',
      '{italic Downloads some data from NosDeputes into ./tmp}',
      '$ yarn start {bold --autoarchiveClone}',
      '{italic Read the NosDeputes datas from ./tmp and insert into the tables}',
      '$ yarn start {bold --autoarchiveInsert}',
      '{italic Everything. Rebuild the whole DB from scratch}',
      '$ yarn start --all',
      '{italic Equivalent to :}',
      '$ yarn start {bold --createTables} {bold --tricoteusesClone} {bold --tricoteusesInsert} {bold --autoarchiveClone} {bold --autoarchiveInsert} {bold --anFetch} {bold --anInsert} {bold --derivedInsert}',
    ],
  },
  {
    header: 'Options',
    optionList: optionDefinitions,
  },
]

function parseArgs(): CommandLineOptions | null {
  try {
    return commandLineArgs(optionDefinitions)
  } catch (err) {
    console.error(err)
    // happens if the user gives a wrong type for an argument
    return null
  }
}

export function parseAndCheckArgs(): CliArgs | null {
  const args = parseArgs()
  const errorMessage =
    'Invalid or missing arguments. Use --help if you need it.'
  if (!args || Object.keys(args).length === 0) {
    console.error(errorMessage)
    return null
  }
  if (args.help) {
    console.log(commandLineUsage(sections))
    return null
  } else {
    return {
      createTables: args.all ?? args.createTables ?? false,
      tricoteusesClone: args.all ?? args.tricoteusesClone ?? false,
      tricoteusesInsert: args.all ?? args.tricoteusesInsert ?? false,
      autoarchiveClone: args.all ?? args.autoarchiveClone ?? false,
      autoarchiveInsert: args.all ?? args.autoarchiveInsert ?? false,
      anFetch: args.all ?? args.anFetch ?? false,
      anInsert: args.all ?? args.anInsert ?? false,
      sandbox: args.sandbox ?? false,
      derivedInsert: args.all ?? args.derivedInsert ?? false,
    }
  }
}
