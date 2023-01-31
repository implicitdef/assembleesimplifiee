import path from 'path'
import { AM030 } from '../utils/tricoteusesDatasets'
import {
  createTable,
  dropTable,
  readFileAsJson,
  readFilesInSubdir,
  WORKDIR,
} from '../utils/utils'
import lo from 'lodash'
import { getDb, NosDeputesDatabase } from '../utils/db'
import { readAutoarchiveSlugs } from '../autoarchive/autoarchiveInsert'

export async function tricoteusesInsertTableDeputesInLegislature() {
  const tableName = 'deputes_in_legislatures'
  const createTableSql = `CREATE TABLE ${tableName} (
    uid TEXT NOT NULL,
    legislature INTEGER NOT NULL,
    UNIQUE (uid, legislature),
    slug TEXT,
    full_name TEXT NOT NULL,
    gender TEXT NOT NULL CHECK (gender IN ('M', 'F')),   
    circo_dpt_name TEXT NOT NULL,
    circo_dpt_num TEXT NOT NULL,
    circo_num TEXT NOT NULL,
    group_uid TEXT,
    group_acronym TEXT,
    group_fonction TEXT,
    group_color TEXT,
    group_pos TEXT CHECK (group_pos IN ('maj', 'min', 'opp')),   
    com_perm_uid TEXT,
    com_perm_name TEXT,
    com_perm_fonction TEXT,
    date_fin TIMESTAMP WITH TIME ZONE
)`
  await dropTable(tableName)
  await createTable(tableName, createTableSql)

  const dir = path.join(WORKDIR, 'tricoteuses', AM030, 'acteurs')
  const filenames = readFilesInSubdir(dir)

  const slugs = readAutoarchiveSlugs()
  const groupes = readAllGroupeParlementaires()
  const comPerms = readAllComPerm()

  const rows = filenames.flatMap(filename => {
    const deputeJson = readFileAsJson(path.join(dir, filename)) as ActeurJson

    const mandatsByLegislature = lo.groupBy(
      deputeJson.mandats.filter(isMandatAssemblee),
      _ => _.legislature,
    )
    if (Object.keys(mandatsByLegislature).length === 0) {
      // is not a depute
      return []
    }
    const lastMandatByLegislature = lo.mapValues(
      mandatsByLegislature,
      mandats => {
        // a depute can have multiple mandats in the same legislature.
        // This could cause confusion in the very unlikely case where he has mandats in different circos
        // Lets' pick the last one
        return lo.last(lo.sortBy(mandats, _ => _.dateFin))!
      },
    )
    const rows = Object.entries(lastMandatByLegislature).map(
      ([legislatureStr, lastMandat]) => {
        const gender = deputeJson.etatCivil.ident.civ === 'Mme' ? 'F' : 'M'
        const uid = deputeJson.uid

        const mandatsGroupeThisLegislature = deputeJson.mandats
          .filter(isMandatGroupe)
          .filter(_ => _.legislature === legislatureStr)
        const lastMandatGroupe = lo.last(
          lo.sortBy(mandatsGroupeThisLegislature, _ => _.dateFin),
        )
        const groupeFonction = lastMandatGroupe?.infosQualite.codeQualite
        const groupeUid = lastMandatGroupe?.organesRefs[0]
        const groupe = groupes.find(_ => _.uid === groupeUid)

        const mandatsComPermThisLegislature = deputeJson.mandats
          .filter(isMandatComPerm)
          .filter(_ => _.legislature === legislatureStr)
        const lastMandatComPerm = lo.last(
          lo.sortBy(mandatsComPermThisLegislature, _ => _.dateFin),
        )
        const comPermFonction = lastMandatComPerm?.infosQualite.codeQualite
        const comPermUid = lastMandatComPerm?.organesRefs[0]
        const comPerm = comPerms.find(_ => _.uid === comPermUid)

        const row: NosDeputesDatabase['deputes_in_legislatures'] = {
          legislature: toInt(legislatureStr),
          uid,
          slug: slugs.find(_ => _.uid === uid)?.slug ?? null,
          full_name: `${deputeJson.etatCivil.ident.prenom}_${deputeJson.etatCivil.ident.nom}`,
          gender,
          circo_dpt_name: lastMandat.election.lieu.departement,
          circo_dpt_num: lastMandat.election.lieu.numDepartement,
          circo_num: toInt(lastMandat.election.lieu.numCirco),
          date_fin: lastMandat.dateFin ?? null,
          group_uid: groupe?.uid ?? null,
          group_acronym: groupe?.libelleAbrev ?? null,
          group_fonction: groupeFonction ?? null,
          group_color: groupe?.couleurAssociee ?? null,
          group_pos:
            groupe?.positionPolitique === 'Majoritaire'
              ? 'maj'
              : groupe?.positionPolitique === 'Minoritaire'
              ? 'min'
              : groupe?.positionPolitique === 'Opposition'
              ? 'opp'
              : null,
          com_perm_uid: comPerm?.uid ?? null,
          com_perm_name: comPerm?.libelleAbrev ?? null,
          com_perm_fonction: comPermFonction ?? null,
        }
        return row
      },
    )
    return rows
  })

  console.log(`Inserting ${rows.length} rows`)

  await getDb().insertInto(tableName).values(rows).execute()
}

function readAllGroupeParlementaires(): OrganeGroupe[] {
  const dir = path.join(WORKDIR, 'tricoteuses', AM030, 'organes')
  const filenames = readFilesInSubdir(dir)
  const groupes = filenames.flatMap(filename => {
    const organeJson = readFileAsJson(path.join(dir, filename)) as OrganeJson
    if (isOrganeGroupe(organeJson)) {
      return [organeJson]
    }
    return []
  })
  return groupes
}

function readAllComPerm(): OrganeComPerm[] {
  const dir = path.join(WORKDIR, 'tricoteuses', AM030, 'organes')
  const filenames = readFilesInSubdir(dir)
  const groupes = filenames.flatMap(filename => {
    const organeJson = readFileAsJson(path.join(dir, filename)) as OrganeJson
    if (isOrganeComPerm(organeJson)) {
      return [organeJson]
    }
    return []
  })
  return groupes
}

type ActeurJson = {
  uid: string
  etatCivil: {
    ident: { civ: 'M.' | 'Mme'; nom: string; prenom: string }
  }
  mandats: Mandat[]
  // there are other fields
}

type Mandat =
  | MandatAssemblee
  | MandatGroupe
  | MandatComPerm
  | {
      typeOrgane: '__other__'
    }

type MandatAssemblee = {
  typeOrgane: 'ASSEMBLEE'
  legislature: string
  election: {
    lieu: {
      departement: string
      numDepartement: string
      numCirco: string
    }
  }
  dateFin?: string
}

type MandatGroupe = {
  typeOrgane: 'GP'
  legislature: string
  dateFin?: string
  infosQualite: {
    codeQualite: FonctionInGroupe
  }
  organesRefs: [string]
}

type MandatComPerm = {
  typeOrgane: 'COMPER'
  legislature: string
  dateFin?: string
  infosQualite: {
    codeQualite: FonctionInCom
  }
  organesRefs: [string]
}

type FonctionInGroupe =
  | 'Président'
  | 'Membre apparenté'
  | 'Membre'
  | 'Député non-inscrit'

type FonctionInCom =
  | 'Président'
  | 'Membre'
  | 'Rapporteur général'
  | 'Secrétaire'
  | 'Vice-Président'

function isMandatAssemblee(mandat: Mandat): mandat is MandatAssemblee {
  return mandat.typeOrgane === 'ASSEMBLEE'
}

function isMandatGroupe(mandat: Mandat): mandat is MandatGroupe {
  return mandat.typeOrgane === 'GP'
}

function isMandatComPerm(mandat: Mandat): mandat is MandatComPerm {
  return mandat.typeOrgane === 'COMPER'
}

type OrganeJson =
  | OrganeGroupe
  | OrganeComPerm
  | {
      codeType: '__other__'
    }

type OrganeGroupe = {
  uid: string
  codeType: 'GP'
  legislature: string
  libelleAbrev: string
  couleurAssociee?: string
  positionPolitique?: 'Majoritaire' | 'Minoritaire' | 'Opposition'
}

type OrganeComPerm = {
  uid: string
  codeType: 'COMPER'
  libelleAbrege: string
  libelleAbrev: string
}

function isOrganeGroupe(organe: OrganeJson): organe is OrganeGroupe {
  return organe.codeType === 'GP'
}

function isOrganeComPerm(organe: OrganeJson): organe is OrganeComPerm {
  return organe.codeType === 'COMPER'
}

function toInt(s: string) {
  return parseInt(s, 10)
}
