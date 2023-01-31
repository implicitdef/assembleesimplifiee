import path from 'path'
import { rmDirIfExists, runCmd, WORKDIR } from '../utils/utils'

export function autoarchiveClone() {
  const datasetName = 'auto_archive_deputes_data'
  const targetDir = path.join(WORKDIR, 'autoarchive')
  console.log(`Cloning ${datasetName} dataset into ${targetDir}`)
  rmDirIfExists(targetDir)
  runCmd(
    `git clone https://github.com/implicitdef/${datasetName}.git ${targetDir}`,
  )
  console.log('Done')
}
