import path from 'path'
import { datasetsToClone } from '../utils/tricoteusesDatasets'
import { rmDirIfExists, runCmd, WORKDIR } from '../utils/utils'

export function tricoteusesClone() {
  const datasets = datasetsToClone
  console.log(`Cloning ${datasets.length} dataset(s) into ${WORKDIR}`)
  datasets.forEach(name => {
    const targetDir = path.join(WORKDIR, 'tricoteuses', name)
    rmDirIfExists(targetDir)
    runCmd(
      `git clone https://git.en-root.org/tricoteuses/data/assemblee-nettoye/${name}_nettoye.git ${targetDir}`,
    )
  })
  console.log('Done')
}
