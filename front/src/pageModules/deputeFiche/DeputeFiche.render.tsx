import Image from 'next/image'

import sortBy from 'lodash/sortBy'
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

  // autres caveats a ajouter :

  // pendant le début du covid (mars-juin 2020) l'assemblee faisait des visio et il n'y avait quasiment plus de compte rendus pour ces réunions
  // les présidents de séance ne sont pas toujours corrects
  // c'est un travail manuel (de la part du service des comptes rendus de l'assemblee), donc il y a quelques erreurs
  // les députés qui sont dans des circos eloignees (DOM-TOM surtout) sont desavantages

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
          </div>
        )
      })}

      <h2 className="mb-4 mt-8 border-b-4 border-dotted border-slate-500 pb-2 text-2xl font-bold">
        Données de présence
      </h2>
      <div>
        <p>
          Ces graphiques montrent{' '}
          <span className="font-bold">approximativement</span> la présence du
          député dans les <span className="font-bold">réunions publiques</span>{' '}
          à l'Assemblée. C'est-à-dire les séances en hémicycle, et les réunions
          de commissions.
        </p>
      </div>
      <div className="my-2 mx-6 rounded-xl bg-yellow-100 py-2 px-6 italic">
        Il y a plusieurs limitations :
        <ul className="list-inside list-disc">
          <li>
            Pour les séances en hémicycle, l'Assemblée ne fait pas de liste de
            présences. Cependant la présence d'un député peut-être devinée s'il
            a fait une prise de parole qui est inscrite dans le compte-rendu, ou
            s'il prend part à un vote électronique public. Un député ne sera pas
            compté s'il ne fait pas de prise de parole et s'il n'y a que des
            votes à main levée .
          </li>
          <li>
            Le reste du travail que fait le député à l'Assemblée n'est pas
            visible. On ne sait pas les réunions qu'il peut faire avec les
            députés de son groupe, avec des électeurs, des lobbyistes, ni le
            travail à son bureau.
          </li>
          <li>
            Nous n'avons pas de visibilité non plus sur tout ce que fait le
            député quand il retourne dans sa circonscription.
          </li>
        </ul>
      </div>
      <div className="my-4">
        <p className="mb-2">
          <span className="font-bold">À notre avis</span>, le fait que le député
          soit plus présent dans les réunions publiques n'indique pas qu'il
          travaille plus, ou mieux qu'un autre. En revanche, si le député ne
          fait aucune réunion publique pendant plusieurs semaines d'affilée, il
          s'agit probablement d'un cas d'absentéisme.
        </p>
      </div>
      {deputesSorted.map(deputeDataInLegislature => {
        const legislature = deputeDataInLegislature.depute.legislature
        return (
          <Stats
            key={legislature}
            legislature={legislature}
            stats={deputeDataInLegislature.stats}
          />
        )
      })}
      <p className="mt-4">
        Ces données sont le fruit du travail régulier de l'association{' '}
        <MyLink href="https://www.regardscitoyens.org">RegardsCitoyens</MyLink>.
      </p>
    </div>
  )
}

function Stats({
  stats,
  legislature,
}: {
  stats: types.WeeklyStats<types.StatsFinal> | null
  legislature: number
}) {
  if (stats) {
    return (
      <div className="">
        <h2 className="ml-8 text-left font-bold">
          {legislature}
          {getOrdinalSuffixFeminine(legislature)} législature
        </h2>
        <div className="h-44">
          <StatsGraph stats={stats} />
        </div>
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
