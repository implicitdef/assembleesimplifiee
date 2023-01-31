import * as lo from 'lodash'
import { getDb } from '../utils/db'
import {
  isMandatAssemblee,
  readAllDeputesAndMap,
} from '../utils/readFromTricoteuses'
import { createTable, dropTable, toInt } from '../utils/utils'

// Construit pour chaque legislature et chaque circonscriptions, les differents mandats de députés qu'il y a eu
// (car dans une même legislature il peut y en avoir plusieurs successifs, à cause des remplacements, élections partielles, etc.)
export async function tricoteusesInsertTableMandatsByCirco() {
  const table = 'mandats_by_circo'
  const createTableSql = `CREATE TABLE ${table} (
    legislature INTEGER NOT NULL,
    circo_uid TEXT NOT NULL,
    data jsonb NOT NULL,
    nb_mandats INTEGER NOT NULL,
    UNIQUE (circo_uid, legislature)
)`
  await dropTable(table)
  await createTable(table, createTableSql)

  const allMandatsOfDeputes = readAllDeputesAndMap(deputeJson => {
    const { mandats, ...restOfDeputeJson } = deputeJson
    const mandatsAssemblee = mandats.filter(isMandatAssemblee)
    return mandatsAssemblee.map(mandat => {
      return {
        depute: restOfDeputeJson,
        mandat,
      }
    })
  }).flat()

  const finalRows = Object.values(
    lo.groupBy(
      allMandatsOfDeputes,
      _ =>
        _.mandat.legislature +
        '-' +
        _.mandat.election.lieu.numDepartement +
        '-' +
        _.mandat.election.lieu.numCirco,
    ),
  ).map(mandatsForCircoRaw => {
    const mandatsForCircoSorted = lo.sortBy(
      mandatsForCircoRaw,
      _ => _.mandat.mandature.datePriseFonction,
    )
    const firstMandat = mandatsForCircoSorted[0].mandat
    const legislature = toInt(firstMandat.legislature)
    const circo = {
      name_dpt: firstMandat.election.lieu.departement,
      num_dpt: firstMandat.election.lieu.numDepartement,
      num_circo: firstMandat.election.lieu.numCirco,
      region: '', // TODO remove this field, useless
      region_type: '', // TODO remove this field, useless
      ref_circo: firstMandat.election.refCirconscription,
    }

    const mandatsWithCorrectCauses = mandatsForCircoSorted.map((row, idx) => {
      const { mandat, depute } = row
      const nextRow = mandatsForCircoSorted[idx + 1] ?? null
      const cause_fin = nextRow
        ? mapCauseMandat(nextRow.mandat.election.causeMandat)
        : null
      return {
        acteur_uid: depute.uid,
        cause_debut: mapCauseMandat(mandat.election.causeMandat),
        ...(cause_fin ? { cause_fin } : null),
        date_debut_mandat: mandat.mandature.datePriseFonction,
        date_fin_mandat: mandat.dateFin ?? null,
        full_name: `${depute.etatCivil.ident.prenom} ${depute.etatCivil.ident.nom}`,
        suppleant_ref: mandat.suppleant?.suppleantRef ?? null,
        mandat_uid: mandat.uid,
      }
    })

    const nb_mandats = mandatsWithCorrectCauses.length
    const mandatsPartitionByElectionsPartielles =
      partitionByElectionsPartielles(mandatsWithCorrectCauses)

    const data: DerivedDeputesMandats = {
      legislature,
      circo,
      mandats: mandatsPartitionByElectionsPartielles,
      nb_mandats,
    }
    return {
      legislature,
      circo_uid: circo.ref_circo,
      nb_mandats,
      data,
    }
  })

  console.log(`Found ${finalRows.length} rows to insert into ${table}`)
  for (const chunkOfRows of lo.chunk(finalRows, 1000)) {
    console.log(`Inserting a chunk of ${chunkOfRows.length}`)
    await getDb().insertInto(table).values(chunkOfRows).execute()
  }
  console.log('Done')
}

type DerivedDeputesMandats = {
  legislature: number
  circo: {
    region_type: string
    region: string
    num_dpt: string
    name_dpt: string
    num_circo: string
    ref_circo: string
  }
  mandats: {
    acteur_uid: string
    cause_debut: CauseChangement
    cause_fin?: CauseChangement
    date_debut_mandat: string
    date_fin_mandat: string | null
    full_name: string
    suppleant_ref: string | null
    mandat_uid: string
  }[][]
  nb_mandats: number
}

type CauseChangement =
  | {
      kind: 'elections_generales'
    }
  | {
      kind: 'remplacement'
      details:
        | 'demission_incompatibilite_mandats'
        | 'decede'
        | 'mission_longue'
        | 'nomme_cc'
        | 'nomme_gvt'
    }
  | {
      kind: 'retour'
      details: 'retour_gvt'
    }
  | {
      kind: 'elections_partielles'
      details?:
        | 'decede_sans_suppleant'
        | 'dechu'
        | 'demission'
        | 'demission_incompatibilite'
        | 'elu_parlement_europeen'
        | 'elu_senat'
        | 'annulation_election'
    }

const cause_mandat_raw = [
  "remplacement d'un député ayant démissionné pour cause d’incompatibilité prévue aux articles LO 137, LO 137-1, LO 141 ou LO 141-1 du code électoral",
  "remplacement d'un député décédé",
  "remplacement d'un député en mission au-delà de 6 mois",
  "remplacement d'un député nommé au Conseil Constitutionnel",
  "remplacement d'un député nommé au Gouvernement",
  "reprise de l'exercice du mandat d'un ancien membre du Gouvernement",
  'élection partielle',
  "élection partielle, en remplacement d'un député décédé et sans suppléant",
  "élection partielle, remplacement d'un député déchu de son mandat",
  "élection partielle, remplacement d'un député démissionnaire",
  "élection partielle, remplacement d'un député démissionnaire d'office",
  "élection partielle, remplacement d'un député démissionnaire d'office (pour incompatibilité)",
  "élection partielle, remplacement d'un député élu au Parlement européen",
  "élection partielle, remplacement d'un député élu au Sénat",
  "élection partielle, suite à l'annulation de l'élection d'un député",
  'élections générales',
] as const
export type CauseMandatRaw = typeof cause_mandat_raw[number]

function mapCauseMandat(cause_mandat: CauseMandatRaw): CauseChangement {
  switch (cause_mandat) {
    case `élections générales`:
      return { kind: 'elections_generales' }
    case "remplacement d'un député ayant démissionné pour cause d’incompatibilité prévue aux articles LO 137, LO 137-1, LO 141 ou LO 141-1 du code électoral":
      return {
        kind: 'remplacement',
        details: 'demission_incompatibilite_mandats',
      }
    case `remplacement d'un député décédé`:
      return {
        kind: 'remplacement',
        details: 'decede',
      }
    case `remplacement d'un député en mission au-delà de 6 mois`:
      return {
        kind: 'remplacement',
        details: 'mission_longue',
      }
    case `remplacement d'un député nommé au Conseil Constitutionnel`:
      return {
        kind: 'remplacement',
        details: 'nomme_cc',
      }
    case `remplacement d'un député nommé au Gouvernement`:
      return {
        kind: 'remplacement',
        details: 'nomme_gvt',
      }
    case `reprise de l'exercice du mandat d'un ancien membre du Gouvernement`:
      return {
        kind: 'retour',
        details: 'retour_gvt',
      }
    case `élection partielle`:
      return {
        kind: 'elections_partielles',
      }
    case `élection partielle, en remplacement d'un député décédé et sans suppléant`:
      return { kind: 'elections_partielles', details: 'decede_sans_suppleant' }
    case `élection partielle, remplacement d'un député déchu de son mandat`:
      return { kind: 'elections_partielles', details: 'dechu' }
    case `élection partielle, remplacement d'un député démissionnaire`:
    case `élection partielle, remplacement d'un député démissionnaire d'office`:
      return { kind: 'elections_partielles', details: 'demission' }
    case `élection partielle, remplacement d'un député démissionnaire d'office (pour incompatibilité)`:
      return {
        kind: 'elections_partielles',
        details: 'demission_incompatibilite',
      }
    case `élection partielle, remplacement d'un député élu au Parlement européen`:
      return {
        kind: 'elections_partielles',
        details: 'elu_parlement_europeen',
      }
    case `élection partielle, remplacement d'un député élu au Sénat`:
      return {
        kind: 'elections_partielles',
        details: 'elu_senat',
      }
    case `élection partielle, suite à l'annulation de l'élection d'un député`:
      return {
        kind: 'elections_partielles',
        details: 'annulation_election',
      }
    default:
      throw new Error(`Unknown cause mandat ${cause_mandat}`)
  }
}

function partitionByElectionsPartielles<
  A extends {
    cause_debut: {
      kind:
        | 'elections_generales'
        | 'remplacement'
        | 'retour'
        | 'elections_partielles'
    }
  },
>(rows: A[]): A[][] {
  const res: A[][] = []
  rows.forEach(row => {
    if (res.length === 0 || row.cause_debut.kind === 'elections_partielles') {
      // start a new subarray
      res.push([])
    }
    // add to the current subarray
    res[res.length - 1].push(row)
  })
  return res
}
