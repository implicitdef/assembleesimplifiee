import lo from 'lodash'
import path from 'path'
import { CliArgs } from '../../utils/cli'
import {
  DOSSIERS_14,
  DOSSIERS_15,
  DOSSIERS_16,
} from '../../utils/tricoteusesDatasets'
import { getDb } from '../../utils/db'
import {
  isNotNull,
  listFilesRecursively,
  readFileAsJson,
  truncateTable,
  WORKDIR,
} from '../../utils/utils'

export async function insertFromDossiers(args: CliArgs) {
  const table = 'dossiers'
  await truncateTable(table)
  // There are some duplicates of reunions accross legislatures
  // I assume the later versions are the better ones, like for the agendas
  // TODO check that one day, are the later versions indeed better ?
  // So we process the latest datasets first
  const datasetsAndLegislature = [
    [DOSSIERS_16, 16],
    [DOSSIERS_15, 15],
    [DOSSIERS_14, 14],
  ] as const
  const uidsInsertedSoFar: string[] = []

  for (const [dataset, legislature] of datasetsAndLegislature) {
    const datasetPath = path.join(
      WORKDIR,
      'tricoteuses',
      dataset,
      // there two subfolders : dossiers and documents
      'dossiers',
    )
    const files = listFilesRecursively(datasetPath)
    console.log(`Inserting these into table ${table}`)
    for (const chunkOfFiles of lo.chunk(files, 1000)) {
      const rows = chunkOfFiles
        .map(f => {
          const json = readFileAsJson(f)
          const uid = json.uid as string
          if (uidsInsertedSoFar.includes(uid)) {
            // Do not insert it, we have already a better version from a later dataset
            return null
          }
          const row = {
            uid,
            data: json,
          }
          return row
        })
        .filter(isNotNull)
      if (rows.length > 0) {
        console.log(`Inserting a chunk of ${rows.length}`)
        await getDb().insertInto(table).values(rows).execute()
        uidsInsertedSoFar.push(...rows.map(_ => _.uid))
      } else {
        console.log('Chunk of 0 length is ignored')
      }
    }
    console.log('Done')
  }
}
