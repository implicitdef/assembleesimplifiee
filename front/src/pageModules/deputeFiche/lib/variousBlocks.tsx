import { GroupeBadge } from '../../../components/GroupeBadge'
import { addPrefixToCirconscription } from '../../../lib/hardcodedData'
import {
  formatDate,
  getAge,
  getOrdinalSuffixFeminine,
} from '../../../lib/utils'
import * as types from '../DeputeFiche.types'

const f = formatDate

export function LegislaturesBlock({
  deputeData,
  legislature: currentLegislature,
}: types.Props) {
  const { legislatures } = deputeData
  const feminine = deputeData.depute.gender === 'F'
  const feminineE = feminine ? 'e' : ''
  if (legislatures.length == 1) {
    return <p>C'est sa première législature</p>
  }
  const otherLegislatures = legislatures.filter(_ => _ != currentLegislature)
  if (
    otherLegislatures.length === 1 &&
    otherLegislatures[0] === currentLegislature - 1
  ) {
    return <p>Était déjà député(e) dans la législature précédente</p>
  }
  if (otherLegislatures.length === 1) {
    const otherLegislature = otherLegislatures[0]
    return (
      <p>
        A aussi été député{feminineE} dans la {otherLegislature}ème législature
      </p>
    )
  }

  return (
    <p>
      A aussi été député{feminineE} dans les{' '}
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
  return dateDebutIsDebutLegislature
    ? `début de la législature (${f(date_debut)})`
    : f(date_debut)
}

function labelDateFinMandat(
  date_fin: string | null,
  date_fin_legislature: string | null,
): string | null {
  const dateFinIsFinLegislature =
    date_fin_legislature !== null && date_fin === date_fin_legislature

  return date_fin
    ? dateFinIsFinLegislature
      ? `jusqu'à la fin de la législature (${f(date_fin)})`
      : `au ${f(date_fin)}`
    : null
}

export function MandatsBlock({ deputeData }: { deputeData: types.DeputeData }) {
  const mandats = deputeData.mandats_this_legislature
  if (mandats.length === 0) {
    // should not happen, but let's be safe
    return null
  }
  const lastMandat = mandats[mandats.length - 1]
  const previousMandats = mandats.filter(_ => _ != lastMandat)
  const { date_debut, date_fin } = lastMandat
  const { date_debut: date_debut_legislature, date_fin: date_fin_legislature } =
    deputeData.legislatureDates

  const feminine = deputeData.depute.gender === 'F'
  const feminineE = feminine ? 'e' : ''
  // Note : pour voir un cas d'un député avec 3 mandats dans la même législature :
  // cf alain-vidalies dans la legislature 14
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
        <div>
          Était déjà en mandat dans cette législature :
          <ul>
            {previousMandats.map(mandat => (
              <li key={mandat.mandat_uid}>
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

export function InformationsBlock(props: types.Props) {
  const { deputeData } = props
  const { depute } = deputeData
  const age = getAge(depute.date_birth)
  const feminine = depute.gender === 'F'
  const feminineE = feminine ? 'e' : ''
  const mandats = deputeData.mandats_this_legislature
  if (mandats.length === 0) {
    // should not happen
    return null
  }
  const lastMandat = mandats[mandats.length - 1]
  const formerDepute = lastMandat.date_fin !== null
  const groupe =
    depute.group_acronym && depute.group_fonction
      ? {
          acronym: depute.group_acronym,
          nom: depute.group_acronym, // TODO il faudrait le nom ?
          fonction: depute.group_fonction,
          color: depute.group_color ?? '#ffffff',
        }
      : null
  return (
    <div className="">
      <h1 className="text-xl">
        {groupe && (
          <GroupeBadge
            acronym={groupe.acronym}
            color={groupe.color}
            nom={groupe.nom}
            fonction={groupe.fonction}
            className="mr-1"
            withFonction={false}
          />
        )}
        <span className="font-bold">{depute.full_name}</span>{' '}
        {formerDepute ? 'était député' : 'Député'}
        {feminineE} de la {depute.circo_num}
        <sup>
          {getOrdinalSuffixFeminine(depute.circo_num)}
        </sup> circonscription{' '}
        {addPrefixToCirconscription(depute.circo_dpt_name)}
      </h1>{' '}
      <div className="py-4">
        <ul className="list-none">
          <li>{age} ans</li>
          <li>
            Groupe
            {groupe && (
              <GroupeBadge
                acronym={groupe.acronym}
                color={groupe.color}
                nom={groupe.nom}
                fonction={groupe.fonction}
                fullName
              />
            )}
          </li>
        </ul>
      </div>
      <MandatsBlock {...{ deputeData }} />
      <LegislaturesBlock {...props} />
    </div>
  )
}
