import commandLineArgs, { CommandLineOptions } from 'command-line-args'
import commandLineUsage, { Section, OptionDefinition } from 'command-line-usage'

export type CliArgs = {
  fetchData: boolean
  insertData: boolean
  doOldTables: boolean
  sandbox: boolean
}

const optionDefinitions: OptionDefinition[] = [
  {
    name: 'fetchData',
    type: Boolean,
    description:
      'Fetch the data, by cloning repositories from Tricoteuses and the Autoarchive repo. If the data is already there, it will be overriden.',
  },
  {
    name: 'insertData',
    type: Boolean,
    description:
      'Create and populates the tables, using the data that has been fetched from the repositories. Drops and recreate the tables if they already exist.',
  },
  {
    name: 'all',
    type: Boolean,
    description: 'Run the full process, i.e. fetchData then insertData.',
  },
  {
    name: 'doOldTables',
    type: Boolean,
    description:
      'NOT MAINTAINED. This creates and populates a bunch of legacy tables (heavier and with more raw JSONs). I keep the code around for now but it might not work anymore',
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
      'By default the script does nothing, you have to activate each step (with --fetchData for example).',
      'If you just want to create the whole DB from scratch, you probably want to do {bold yarn start --all}',
    ],
  },
  {
    header: 'Examples',
    content: [
      '{italic Display this help}',
      '$ yarn start {bold --help}',
      '{italic Clone the data from external repos into ./tmp}',
      '$ yarn start {bold --fetchData}',
      '{italic Read the data from ./tmp and insert into the tables (drops/recreates the tables first)}',
      '$ yarn start {bold --insertData}',
      '{italic Everything. Rebuild the whole DB from scratch}',
      '$ yarn start --all',
      '{italic Equivalent to :}',
      '$ yarn start {bold --fetchData} {bold --insertData}',
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
      fetchData: args.all ?? args.fetchData ?? false,
      insertData: args.all ?? args.insertData ?? false,
      doOldTables: args.doOldTables ?? false,
      sandbox: args.sandbox ?? false,
    }
  }
}
