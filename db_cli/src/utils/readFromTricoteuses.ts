import path from 'path'
import { CauseMandatRaw } from '../derived/insertDerivedDeputesMandats'
import { AM030 } from './tricoteusesDatasets'
import { readFileAsJson, readFilesInSubdir, WORKDIR } from './utils'

function readOrganesAndFilter<Subtype extends OrganeJson>(
  filterFunction: (o: OrganeJson) => o is Subtype,
): Subtype[] {
  const dir = path.join(WORKDIR, 'tricoteuses', AM030, 'organes')
  const filenames = readFilesInSubdir(dir)
  const res = filenames.flatMap(filename => {
    const organeJson = readFileAsJson(path.join(dir, filename)) as OrganeJson
    if (filterFunction(organeJson)) {
      return [organeJson]
    }
    return []
  })
  return res
}

export function readAllAssemblees(): OrganeAssemblee[] {
  return readOrganesAndFilter(isOrganeAssemblee)
}

export function readAllGroupeParlementaires(): OrganeGroupe[] {
  return readOrganesAndFilter(isOrganeGroupe)
}

export function readAllComPerm(): OrganeComPerm[] {
  return readOrganesAndFilter(isOrganeComPerm)
}

export function readAllDeputesAndMap<A>(
  mapFunction: (depute: ActeurJson) => A,
): A[] {
  const dir = path.join(WORKDIR, 'tricoteuses', AM030, 'acteurs')
  const filenames = readFilesInSubdir(dir)
  const res: A[] = []
  filenames.flatMap(filename => {
    const deputeJson = readFileAsJson(path.join(dir, filename)) as ActeurJson
    if (deputeJson.mandats.some(isMandatAssemblee)) {
      // it is a depute
      res.push(mapFunction(deputeJson))
    }
  })
  return res
}

export type ActeurJson = {
  uid: string
  etatCivil: {
    ident: { civ: 'M.' | 'Mme'; nom: string; prenom: string }
  }
  mandats: Mandat[]
  // there are other fields
}

export type Mandat =
  | MandatAssemblee
  | MandatGroupe
  | MandatComPerm
  | {
      typeOrgane: '__other__'
    }

export type MandatAssemblee = {
  typeOrgane: 'ASSEMBLEE'
  uid: string
  legislature: string
  election: {
    lieu: {
      departement: string
      numDepartement: string
      numCirco: string
    }
    causeMandat: CauseMandatRaw
    // cette id change à chaque législature
    refCirconscription: string
  }
  suppleant?: {
    suppleantRef: string
  }
  dateFin?: string
  // c'est la date de debut
  mandature: { datePriseFonction: string }
}

export type MandatGroupe = {
  typeOrgane: 'GP'
  legislature: string
  dateFin?: string
  infosQualite: {
    codeQualite: FonctionInGroupe
  }
  organesRefs: [string]
}

export type MandatComPerm = {
  typeOrgane: 'COMPER'
  legislature: string
  dateFin?: string
  infosQualite: {
    codeQualite: FonctionInCom
  }
  organesRefs: [string]
}

export type FonctionInGroupe =
  | 'Président'
  | 'Membre apparenté'
  | 'Membre'
  | 'Député non-inscrit'

export type FonctionInCom =
  | 'Président'
  | 'Membre'
  | 'Rapporteur général'
  | 'Secrétaire'
  | 'Vice-Président'

export function isMandatAssemblee(mandat: Mandat): mandat is MandatAssemblee {
  return mandat.typeOrgane === 'ASSEMBLEE'
}

export function isMandatGroupe(mandat: Mandat): mandat is MandatGroupe {
  return mandat.typeOrgane === 'GP'
}

export function isMandatComPerm(mandat: Mandat): mandat is MandatComPerm {
  return mandat.typeOrgane === 'COMPER'
}

export type OrganeJson =
  | OrganeAssemblee
  | OrganeGroupe
  | OrganeComPerm
  | {
      codeType: '__other__'
    }

export type OrganeAssemblee = {
  uid: string
  codeType: 'ASSEMBLEE'
  legislature: string
  viMoDe: { dateFin?: string }
}

export type OrganeGroupe = {
  uid: string
  codeType: 'GP'
  legislature: string
  libelleAbrev: string
  couleurAssociee?: string
  positionPolitique?: 'Majoritaire' | 'Minoritaire' | 'Opposition'
}

export type OrganeComPerm = {
  uid: string
  codeType: 'COMPER'
  libelleAbrege: string
  libelleAbrev: string
}

export function isOrganeAssemblee(
  organe: OrganeJson,
): organe is OrganeAssemblee {
  return organe.codeType === 'ASSEMBLEE'
}

export function isOrganeGroupe(organe: OrganeJson): organe is OrganeGroupe {
  return organe.codeType === 'GP'
}

export function isOrganeComPerm(organe: OrganeJson): organe is OrganeComPerm {
  return organe.codeType === 'COMPER'
}
