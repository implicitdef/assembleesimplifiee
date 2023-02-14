import { GroupeBadge } from '../../../components/GroupeBadge'
import { MyLink } from '../../../components/MyLink'
import {
  FonctionInBureau,
  FonctionInCom,
  ReleveTables,
} from '../../../lib/dbReleve'
import {
  addPrefixToCirconscription,
  getComPermNameWithPrefix,
} from '../../../lib/hardcodedData'
import {
  formatDate,
  getAge,
  getOrdinalSuffixFeminine,
} from '../../../lib/utils'
import * as types from '../DeputeFiche.types'

const f = formatDate

export function LegislaturesBlock({
  deputeData,
  legislatures,
}: {
  deputeData: types.DeputeDataForLegislature
  legislatures: number[]
}) {
  const currentLegislature = deputeData.depute.legislature
  const fem = deputeData.depute.gender === 'F'
  const femE = fem ? 'e' : ''
  if (legislatures.length == 1) {
    return <p>C'est sa première législature</p>
  }
  const otherLegislatures = legislatures.filter(_ => _ != currentLegislature)
  if (
    otherLegislatures.length === 1 &&
    otherLegislatures[0] === currentLegislature - 1
  ) {
    return <p>Était déjà député{femE} dans la législature précédente</p>
  }
  if (otherLegislatures.length === 1) {
    const otherLegislature = otherLegislatures[0]
    return (
      <p>
        A aussi été député{femE} dans la {otherLegislature}ème législature
      </p>
    )
  }

  return (
    <p>
      A aussi été député{femE} dans les{' '}
      {otherLegislatures.map(_ => `${_}ème`).join(', ')} législatures{' '}
    </p>
  )
}

function areDatesCloseEnough(
  a: string,
  b: string,
  toleranceInDays: number = 5,
) {
  const aTime = new Date(a).getTime()
  const bTime = new Date(b).getTime()
  const timeDifference = Math.abs(aTime - bTime)
  const toleranceInMilliseconds = toleranceInDays * 24 * 60 * 60 * 1000
  return timeDifference < toleranceInMilliseconds
}

function labelDateDebutMandat(
  date_debut: string,
  date_debut_legislature: string,
): string {
  const dateDebutIsDebutLegislature = areDatesCloseEnough(
    date_debut,
    date_debut_legislature,
  )
  return dateDebutIsDebutLegislature ? `début de la législature` : f(date_debut)
}

function labelDateFinMandat(
  date_fin: string | null,
  date_fin_legislature: string | null,
): string | null {
  const dateFinIsFinLegislature =
    date_fin_legislature !== null && date_fin === date_fin_legislature

  return date_fin
    ? dateFinIsFinLegislature
      ? `jusqu'à la fin de la législature`
      : `au ${f(date_fin)}`
    : null
}

export function MandatsBlock({
  deputeData,
}: {
  deputeData: types.DeputeDataForLegislature
}) {
  const mandats = deputeData.mandats
  if (mandats.length === 0) {
    // should not happen, but let's be safe
    return null
  }
  const lastMandat = mandats[mandats.length - 1]
  const previousMandats = mandats.filter(_ => _ != lastMandat)
  const { date_debut, date_fin } = lastMandat
  const { date_debut: date_debut_legislature, date_fin: date_fin_legislature } =
    deputeData.legislatureDates

  const gender = deputeData.depute.gender
  const feminine = gender === 'F'
  const feminineE = feminine ? 'e' : ''

  return (
    <div className="">
      <p>
        {date_fin
          ? `Était député${feminineE} du ${labelDateDebutMandat(
              date_debut,
              date_debut_legislature,
            )} ${labelDateFinMandat(date_fin, date_fin_legislature)}`
          : `Député${feminineE} depuis le ${labelDateDebutMandat(
              date_debut,
              date_debut_legislature,
            )}`}
      </p>
      {previousMandats.length === 1 && (
        <div>
          Était déjà en mandat dans cette législature du{' '}
          {labelDateDebutMandat(
            previousMandats[0].date_debut,
            date_debut_legislature,
          )}{' '}
          {labelDateFinMandat(
            previousMandats[0].date_fin,
            date_fin_legislature,
          )}
        </div>
      )}
      {previousMandats.length > 1 && (
        // Note : pour voir cas cas (un député avec 3 mandats dans la même législature) :
        // cf alain-vidalies dans la legislature 14
        <div>
          Était déjà en mandat dans cette législature :
          <ul className="list-disc">
            {previousMandats.map(mandat => (
              <li key={mandat.mandat_uid} className="ml-8">
                Du{' '}
                {labelDateDebutMandat(
                  mandat.date_debut,
                  date_debut_legislature,
                )}{' '}
                {labelDateFinMandat(mandat.date_fin, date_fin_legislature)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export function InformationsBlock({
  deputeData,
  nosDeputesUrl,
  legislatures,
}: {
  deputeData: types.DeputeDataForLegislature
  nosDeputesUrl: string | null
  legislatures: number[]
}) {
  const { depute } = deputeData
  const age = getAge(depute.date_birth)
  const { gender } = depute
  const feminine = gender === 'F'
  const feminineE = feminine ? 'e' : ''
  const mandats = deputeData.mandats
  if (mandats.length === 0) {
    // should not happen
    return null
  }
  const lastMandat = mandats[mandats.length - 1]
  const formerDepute = lastMandat.date_fin !== null
  const groupe =
    depute.group_acronym && depute.group_name && depute.group_fonction
      ? {
          acronym: depute.group_acronym,
          nom: depute.group_name,
          fonction: depute.group_fonction,
          color: depute.group_color ?? '#ffffff',
        }
      : null
  return (
    <div className="">
      <h1 className="text-xl">
        <span className="font-bold">{depute.full_name}</span>{' '}
        {formerDepute ? 'était député' : 'Député'}
        {feminineE} de la {depute.circo_num}
        <sup>
          {getOrdinalSuffixFeminine(depute.circo_num)}
        </sup> circonscription{' '}
        {addPrefixToCirconscription(depute.circo_dpt_name)} (
        {depute.circo_dpt_num})
      </h1>
      {depute.bureau_an_fonction && (
        <p className="font-bold">
          {translateFonctionInBureau(depute.bureau_an_fonction, gender)}
        </p>
      )}
      {depute.com_perm_fonction && depute.com_perm_name && (
        <p className="">
          {/* <span className="">Commission permanente : </span>{' '} */}
          <span className="">
            Commission {getComPermNameWithPrefix(depute.com_perm_name)}
          </span>{' '}
          {depute.com_perm_fonction !== 'Membre' ? (
            <span className="font-bold">
              ({translateFonctionInCom(depute.com_perm_fonction, gender)})
            </span>
          ) : null}
        </p>
      )}
      <p className="">
        Groupe
        {groupe && (
          <GroupeBadge
            acronym={groupe.acronym}
            color={groupe.color}
            nom={groupe.nom}
            fonction={groupe.fonction}
            className="ml-1"
            fonctionClassName="font-bold"
            fullName
          />
        )}
      </p>
      <p className="mb-4">{age} ans</p>

      <MandatsBlock {...{ deputeData }} />
      <LegislaturesBlock {...{ deputeData }} legislatures={legislatures} />
      <p className="">
        <MyLink
          href={`https://www.assemblee-nationale.fr/dyn/deputes/${deputeData.depute.uid}`}
          targetBlank
        >
          Voir sa fiche sur le site officiel de l'AN
        </MyLink>
      </p>
      {nosDeputesUrl && (
        <p>
          <MyLink href={`${nosDeputesUrl}`} targetBlank>
            Voir sa fiche sur NosDéputés.fr
          </MyLink>
        </p>
      )}
    </div>
  )
}

function translateFonctionInCom(
  fonction: FonctionInCom,
  gender: ReleveTables['deputes_in_legislatures']['gender'],
) {
  const femE = gender === 'F' ? 'e' : ''
  switch (fonction) {
    case 'Vice-Président':
      return `Vice-président${femE}`
    case 'Président':
      return `Président${femE}`
    case 'Rapporteur général':
      return `Rapporteur${femE} générale`
    default:
      return fonction
  }
}

function translateFonctionInBureau(
  fonction: FonctionInBureau,
  gender: ReleveTables['deputes_in_legislatures']['gender'],
) {
  const femE = gender === 'F' ? 'e' : ''
  switch (fonction) {
    case 'Vice-Président':
      return `Vice-Président${femE} de l'Assemblée
          Nationale`

    case 'Président':
      return `Président${femE} de l'Assemblée
          Nationale`
    case 'Secrétaire':
      return `Secrétaire de l'Assemblée
          Nationale`
    case 'Questeur':
      return `Questeur${femE}`
    default:
      return fonction
  }
}
