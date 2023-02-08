import { getDb } from './utils/db'
import lo from 'lodash'
import path from 'path'
import { readFileAsJson, readFilesInSubdir, WORKDIR } from './utils/utils'
import { AM030 } from './utils/tricoteusesDatasets'

export async function sandbox() {
  console.log('@@@ sandbox')
  findOrganesYaelBraunPivet()
  return Promise.resolve()
}

// pour essayer de voir si le Bureau est apparu
function findOrganesYaelBraunPivet() {
  const yealBraunPivetFile = path.join(
    WORKDIR,
    'tricoteuses',
    AM030,
    'acteurs',
    'PA721908.json',
  )
  const acteurJson = readFileAsJson(yealBraunPivetFile)
  const mandats = acteurJson.mandats.map((mandat: any) => {
    console.log(
      mandat.uid,
      mandat.typeOrgane,
      mandat.infosQualite.codeQualite,
      mandat.organesRefs,
    )
  })

  // console.log(acteurJson)
}
