import path from 'path'
import {
  readAllComPerm,
  readAllDeputesAndMap,
} from './utils/readFromTricoteuses'
import { AM030 } from './utils/tricoteusesDatasets'
import { readFileAsJson, readFilesInSubdir, WORKDIR } from './utils/utils'

export async function sandbox() {
  console.log('@@@ sandbox')

  const dir = path.join(WORKDIR, 'tricoteuses', AM030, 'organes')
  const filenames = readFilesInSubdir(dir)
  const res = filenames.flatMap(filename => {
    const organeJson = readFileAsJson(path.join(dir, filename))
    if (organeJson.codeType === 'BUREAU') {
      console.log('-----')
      console.log(organeJson)
    }
  })

  return Promise.resolve()
}

const DANIELE_OBONO = 'PA721960'
const CHRISTOPHE_BLANCHET = 'PA719024'
const YAEL_BRAUN_PIVET = 'PA721908'

const BUREAU_UID = 'PO800442'

// pour essayer de voir si le Bureau est apparu
function findOrganesOfDepute(deputeUid: string) {
  const yealBraunPivetFile = path.join(
    WORKDIR,
    'tricoteuses',
    AM030,
    'acteurs',
    `${deputeUid}.json`,
  )
  const acteurJson = readFileAsJson(yealBraunPivetFile)
  const mandats = acteurJson.mandats.map((mandat: any) => {
    console.log(
      mandat.uid,
      mandat.typeOrgane,
      mandat.infosQualite.libQualite,
      mandat.organesRefs,
    )
  })

  // console.log(acteurJson)
}
