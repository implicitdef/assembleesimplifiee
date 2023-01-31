import lo from 'lodash'
import path from 'path'
import { readAutoarchiveSlugs } from './autoarchiveInsert'
import { getDb, NosDeputesDatabase } from '../utils/db'
import {
  ActeurJson,
  isMandatAssemblee,
  isMandatComPerm,
  isMandatGroupe,
  MandatAssemblee,
  readAllAssemblees,
  readAllComPerm,
  readAllDeputesAndMap,
  readAllGroupeParlementaires,
} from '../utils/readFromTricoteuses'
import { AM030 } from '../utils/tricoteusesDatasets'
import {
  createTable,
  dropTable,
  readFilesInSubdir,
  toInt,
  WORKDIR,
} from '../utils/utils'

export async function tricoteusesInsertTableDeputesInLegislature() {
  const tableName = 'deputes_in_legislatures'
  const createTableSql = `CREATE TABLE ${tableName} (
    uid TEXT NOT NULL,
    legislature INTEGER NOT NULL,
    UNIQUE (uid, legislature),
    slug TEXT,
    full_name TEXT NOT NULL,
    date_birth TEXT NOT NULL,
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
    date_fin TEXT,
    ongoing BOOLEAN NOT NULL
)`
  await dropTable(tableName)
  await createTable(tableName, createTableSql)

  const slugs = readAutoarchiveSlugs()
  const assemblees = readAllAssemblees()
  const groupes = readAllGroupeParlementaires()
  const comPerms = readAllComPerm()

  const rows = readDeputesEachLegislatureAndMap(
    (deputeJson, legislature, lastMandatThisLegislature) => {
      const legislatureStr = legislature.toString()
      const lastMandat = lastMandatThisLegislature
      const gender = deputeJson.etatCivil.ident.civ === 'Mme' ? 'F' : 'M'
      const uid = deputeJson.uid

      const assemblee = assemblees.find(_ => _.legislature === legislatureStr)
      if (!assemblee) {
        throw new Error(`Didn't find assemblee ${legislatureStr}`)
      }

      const mandatsGroupeThisLegislature = deputeJson.mandats
        .filter(isMandatGroupe)
        .filter(_ => _.legislature === legislatureStr)
      const lastMandatGroupe = takeLatest(mandatsGroupeThisLegislature)
      const groupeFonction = lastMandatGroupe?.infosQualite.codeQualite
      const groupeUid = lastMandatGroupe?.organesRefs[0]
      const groupe = groupes.find(_ => _.uid === groupeUid)

      const mandatsComPermThisLegislature = deputeJson.mandats
        .filter(isMandatComPerm)
        .filter(_ => _.legislature === legislatureStr)
      const lastMandatComPerm = takeLatest(mandatsComPermThisLegislature)
      const comPermFonction = lastMandatComPerm?.infosQualite.codeQualite
      const comPermUid = lastMandatComPerm?.organesRefs[0]
      const comPerm = comPerms.find(_ => _.uid === comPermUid)

      const row: NosDeputesDatabase['deputes_in_legislatures'] = {
        legislature: toInt(legislatureStr),
        uid,
        slug: slugs.find(_ => _.uid === uid)?.slug ?? null,
        full_name: `${deputeJson.etatCivil.ident.prenom} ${deputeJson.etatCivil.ident.nom}`,
        date_birth: deputeJson.etatCivil.infoNaissance.dateNais,
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
        ongoing:
          lastMandat.dateFin === undefined ||
          (assemblee.viMoDe.dateFin !== undefined &&
            // on marque comme "ongoing" les mandats qui étaient encore en cours lorsque la législature s'est terminée
            assemblee.viMoDe.dateFin <= lastMandat.dateFin),
      }
      return row
    },
  )
  console.log(`Inserting ${rows.length} rows`)
  await getDb().insertInto(tableName).values(rows).execute()
}

function readDeputesEachLegislatureAndMap<A>(
  mapFunction: (
    deputeJson: ActeurJson,
    legislature: number,
    lastMandatThisLegislature: MandatAssemblee,
  ) => A,
): A[] {
  const dir = path.join(WORKDIR, 'tricoteuses', AM030, 'acteurs')
  const filenames = readFilesInSubdir(dir)

  const rows: A[] = []
  readAllDeputesAndMap(deputeJson => {
    const mandatsAssembleeByLegislature = lo.groupBy(
      deputeJson.mandats.filter(isMandatAssemblee),
      _ => _.legislature,
    )
    const lastMandatByLegislature = lo.mapValues(
      mandatsAssembleeByLegislature,
      mandats => {
        // a depute can have multiple mandats in the same legislature.
        // This could cause confusion in the very unlikely case where he has mandats in different circos
        // Lets' pick the last one
        return takeLatest(mandats)!
      },
    )
    Object.entries(lastMandatByLegislature).forEach(
      ([legislatureStr, lastMandat]) => {
        const row = mapFunction(deputeJson, toInt(legislatureStr), lastMandat)
        rows.push(row)
      },
    )
  })
  return rows
}

// Given an array objects with a dateFin,
// will return the one where dateFin is the latest
// An undefined value for dateFin is considered as the latest
function takeLatest<A extends { dateFin?: string }>(arr: A[]): A | undefined {
  return lo.last(lo.sortBy(arr, _ => _.dateFin))
}
