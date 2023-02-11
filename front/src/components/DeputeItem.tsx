import { FonctionInGroupe } from '../lib/addLatestGroup'
import type {
  FonctionInBureau,
  FonctionInCom,
  ReleveTables,
} from '../lib/dbReleve'
import {
  ComPermAcronym,
  getComPermNameWithPrefix,
  LATEST_LEGISLATURE,
} from '../lib/hardcodedData'
import { GroupeBadge } from './GroupeBadge'
import { MyLink } from './MyLink'

type Props = {
  depute: {
    uid: string
    fullName: string
    circo_departement: string
    slug: string | null
    mandat_ongoing: boolean
    latestGroup: {
      nom: string
      acronym: string
      fonction: FonctionInGroupe
      color: string
    } | null
    latestComPerm?: {
      fonction: FonctionInCom
      name_short: ComPermAcronym
      name_long: string
    } | null
    bureau_an_fonction: FonctionInBureau | null
    gender: 'M' | 'F'
  }
  legislature: number
  displayCirco?: boolean
  className?: string
}

export function DeputeItem({
  depute: {
    slug,
    latestGroup,
    latestComPerm,
    fullName,
    circo_departement: circoDepartement,
    mandat_ongoing: mandatOngoing,
    gender,
    bureau_an_fonction,
  },
  legislature,
  displayCirco,
  className,
}: Props) {
  const bg = mandatOngoing ? 'bg-white' : 'bg-slate-200'
  const borderSize = latestGroup ? ` border-2 border-r-4` : ''

  const displayBureauFonction = bureau_an_fonction !== null

  const displayComPerm =
    !displayBureauFonction &&
    latestComPerm &&
    latestComPerm.fonction !== 'Membre' &&
    latestComPerm.name_short

  return (
    <div
      className={`border-3 flex min-h-[52px] flex-row  border-black ${borderSize} ${bg} ${className}`}
    >
      {latestGroup && (
        <GroupeBadge
          acronym={latestGroup.acronym}
          color={latestGroup.color}
          nom={latestGroup.nom}
          fonction={latestGroup.fonction}
        />
      )}
      <div
        className={`flex w-full flex-col items-start ${
          displayComPerm ? 'justify-between' : 'justify-center'
        }`}
      >
        <div className="px-2">
          {slug ? (
            <MyLink
              href={`/depute/${slug}${
                legislature !== LATEST_LEGISLATURE ? `/${legislature}` : ''
              }`}
            >
              {fullName}
            </MyLink>
          ) : (
            fullName
          )}

          {displayCirco && (
            <span className="bg-blue cursor-default text-slate-400">
              {' '}
              {circoDepartement}
            </span>
          )}
        </div>

        {(displayComPerm || displayBureauFonction) && (
          <div className="block h-1/2 w-full overflow-hidden bg-slate-300 px-2 italic text-slate-600">
            {displayBureauFonction &&
              translateFonctionInBureau(bureau_an_fonction, gender)}
            {displayComPerm &&
              `${translateFonctionInCom(latestComPerm.fonction, gender)} Com.
                ${getComPermNameWithPrefix(latestComPerm.name_short).replace(
                  'développement',
                  'dév.',
                )}`}
          </div>
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
      return 'VP'
    case 'Président':
      return 'Président' + femE
    case 'Rapporteur général':
      return `Rapporteur${femE} gén.`
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
      return `Vice-Président${femE} de l'AN`
    case 'Président':
      return `Président${femE} de l'AN`
    case 'Secrétaire':
      return `Secrétaire de l'AN`
    case 'Questeur':
      return `Questeur${femE}`
    default:
      return fonction
  }
}

export type NewDeputeItemProps = {
  depute: ReleveTables['deputes_in_legislatures']
  legislature: number
  displayCirco?: boolean
  className?: string
}

export function NewDeputeItem({
  depute,
  legislature,
  displayCirco,
  className,
}: NewDeputeItemProps) {
  const latestGroup =
    depute.group_acronym && depute.group_fonction
      ? {
          nom: depute.group_name,
          acronym: depute.group_acronym,
          color: depute.group_color ?? '#ffffff',
          fonction: depute.group_fonction,
        }
      : null
  const latestComPerm =
    depute.com_perm_fonction && depute.com_perm_name
      ? {
          fonction: depute.com_perm_fonction,
          name_short: depute.com_perm_name,
          name_long: depute.com_perm_name,
        }
      : null
  const deputeOldShape: Props['depute'] = {
    uid: depute.uid,
    fullName: depute.full_name,
    circo_departement: depute.circo_dpt_name,
    slug: depute.slug,
    mandat_ongoing: depute.ongoing,
    latestGroup,
    latestComPerm,
    gender: depute.gender,
    bureau_an_fonction: depute.bureau_an_fonction,
  }

  return (
    <DeputeItem
      {...{ legislature, displayCirco, className }}
      depute={deputeOldShape}
    />
  )
}
