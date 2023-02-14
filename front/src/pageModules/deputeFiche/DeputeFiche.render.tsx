import Image from 'next/image'

import sortBy from 'lodash/sortBy'
import { Fragment } from 'react'
import { GroupeBadge } from '../../components/GroupeBadge'
import { MyLink } from '../../components/MyLink'
import {
  FonctionInBureau,
  FonctionInCom,
  ReleveTables,
} from '../../lib/dbReleve'
import {
  addPrefixToCirconscription,
  getComPermNameWithPrefix,
  LATEST_LEGISLATURE,
} from '../../lib/hardcodedData'
import { formatDate, getAge, getOrdinalSuffixFeminine } from '../../lib/utils'
import * as types from './DeputeFiche.types'
import { StatsGraph } from './lib/StatsGraph'

export function Page(props: types.Props) {
  const { deputeData } = props
  const { dataInLegislatures, nosDeputesUrl } = deputeData
  const deputesSorted = sortBy(dataInLegislatures, _ => -_[0]).map(_ => _[1])
  const latestDeputeData = deputesSorted[0]
  const otherDeputeData = deputesSorted.slice(1)
  const legislatures = deputesSorted.map(_ => _.depute.legislature)
  const { uid, full_name, gender } = latestDeputeData.depute
  const fem = gender === 'F'
  const femE = fem ? 'e' : ''
  return (
    <div className="">
      <h1 className="mx-auto mb-10 w-fit border-8 border-double border-black px-14 py-4 text-center text-4xl font-bold uppercase">
        Fiche de {full_name}
      </h1>

      <div>
        <div className="flex gap-4">
          <Image
            className="self-start border-4 border-black"
            src={`/deputes/photos/${LATEST_LEGISLATURE}/${uid.substring(
              2,
            )}.jpg`}
            alt={`Photo ${fem ? 'de la' : 'du'} député${femE} ${full_name}`}
            width={150}
            height={192}
          />
          <InfosBlock
            deputeData={latestDeputeData}
            {...{ nosDeputesUrl, legislatures }}
            isForLatestLegislature
          />
        </div>
        <Stats stats={latestDeputeData.stats} />
      </div>

      {otherDeputeData.length > 0 && (
        <h2 className="mb-4 mt-8 border-b-4 border-dotted border-slate-500 pb-2 text-2xl font-bold">
          Législatures précédentes
        </h2>
      )}
      {otherDeputeData.map(deputeData => {
        const legislature = deputeData.depute.legislature
        return (
          <div className="mb-8" key={legislature}>
            <InfosBlock
              {...{ deputeData, nosDeputesUrl, legislatures }}
              isForLatestLegislature={false}
            />
            <Stats stats={deputeData.stats} />
          </div>
        )
      })}
    </div>
  )
}

function Stats({
  stats,
}: {
  stats: types.WeeklyStats<types.StatsFinal> | null
}) {
  if (stats) {
    return (
      <div className=" my-4 h-44 p-4 pb-8">
        <h2 className="text-center text-xl font-bold">
          Présences à l'Assemblée
        </h2>
        <StatsGraph stats={stats} />
      </div>
    )
  }
  return null
}

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

function ComPerm({ depute }: { depute: types.Depute }) {
  const { gender } = depute
  return (
    <>
      {depute.com_perm_fonction && depute.com_perm_name && (
        <p className="">
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
    </>
  )
}

function Groupe({ depute }: { depute: types.Depute }) {
  if (
    depute.group_acronym &&
    depute.group_name &&
    depute.group_fonction &&
    depute.group_color
  ) {
    return (
      <p className="">
        Groupe
        <GroupeBadge
          acronym={depute.group_acronym}
          color={depute.group_color}
          nom={depute.group_name}
          fonction={depute.group_fonction}
          className="ml-1"
          fonctionClassName="font-bold"
          fullName
        />
      </p>
    )
  }
  return null
}

function Age({ depute }: { depute: types.Depute }) {
  const age = getAge(depute.date_birth)
  return <p className="">{age} ans</p>
}

function ExternalLinks({
  depute,
  nosDeputesUrl,
}: {
  depute: types.Depute
  nosDeputesUrl: string | null
}) {
  return (
    <>
      <p className="">
        <MyLink
          href={`https://www.assemblee-nationale.fr/dyn/deputes/${depute.uid}`}
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
    </>
  )
}

function NameAndCircoTitle({
  deputeData,
  isForLatestLegislature,
}: {
  deputeData: types.DeputeDataForLegislature
  isForLatestLegislature: boolean
}) {
  const { mandats, depute } = deputeData
  if (mandats.length === 0) {
    // should not happen
    return null
  }
  const lastMandat = mandats[mandats.length - 1]
  const formerDepute = lastMandat.date_fin !== null
  const { gender, legislature } = depute
  const feminine = gender === 'F'
  const feminineE = feminine ? 'e' : ''

  const firstPart = isForLatestLegislature ? (
    <span className="font-bold">{depute.full_name}</span>
  ) : (
    <span>
      Dans la{' '}
      <span className="font-bold">
        {legislature}
        {getOrdinalSuffixFeminine(legislature)} législature
      </span>
      , {feminine ? 'elle' : 'il'}
    </span>
  )

  return (
    <h1 className="text-xl">
      {firstPart} {formerDepute ? 'était député' : 'Député'}
      {feminineE} de la {depute.circo_num}
      <sup>
        {getOrdinalSuffixFeminine(depute.circo_num)}
      </sup> circonscription {addPrefixToCirconscription(depute.circo_dpt_name)}{' '}
      ({depute.circo_dpt_num})
    </h1>
  )
}

export function InfosBlock({
  deputeData,
  nosDeputesUrl,
  legislatures,
  isForLatestLegislature,
  className = '',
}: {
  deputeData: types.DeputeDataForLegislature
  nosDeputesUrl: string | null
  legislatures: number[]
  isForLatestLegislature: boolean
  className?: string
}) {
  const { depute } = deputeData
  const { gender } = depute
  return (
    <div className={className}>
      <NameAndCircoTitle {...{ deputeData, isForLatestLegislature }} />
      {depute.bureau_an_fonction && (
        <p className="font-bold">
          {translateFonctionInBureau(depute.bureau_an_fonction, gender)}
        </p>
      )}
      <ComPerm {...{ depute }} />
      <Groupe {...{ depute }} />
      {isForLatestLegislature && <Age {...{ depute }} />}
      <div className="mt-4">
        <MandatsBlock {...{ deputeData }} />
        {isForLatestLegislature && (
          <>
            <LegislaturesBlock
              {...{ deputeData }}
              legislatures={legislatures}
            />
            <ExternalLinks {...{ depute, nosDeputesUrl }} />
          </>
        )}
      </div>
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
