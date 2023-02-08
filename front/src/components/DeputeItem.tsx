import { GroupeBadgeWithFonction } from './GroupeBadge'
import { MyLink } from './MyLink'
import { FonctionInGroupe } from '../lib/addLatestGroup'
import {
  ComPermAcronym,
  getComPermNameWithPrefix,
  LATEST_LEGISLATURE,
} from '../lib/hardcodedData'
import type { ReleveTables, FonctionInCom } from '../lib/dbReleve'

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
  },
  legislature,
  displayCirco,
  className,
}: Props) {
  const bg = mandatOngoing ? 'bg-white' : 'bg-slate-200'
  const borderSize = latestGroup ? `border ` : ''

  const displayComPerm =
    latestComPerm &&
    latestComPerm.fonction !== 'Membre' &&
    latestComPerm.name_short
  return (
    <div
      className={`border-3 flex min-h-[52px] flex-row  border-black ${borderSize} ${bg} ${className}`}
    >
      <GroupeBadgeWithFonction groupe={latestGroup} marginLeft={false} />
      <div
        className={`flex w-full flex-col items-start ${
          displayComPerm ? 'justify-between' : 'justify-center'
        }`}
      >
        <div className="px-2">
          {slug ? (
            <MyLink
              href={`/${slug}${
                legislature !== LATEST_LEGISLATURE ? `/${legislature}` : ''
              }`}
              textColorClassOverride={
                mandatOngoing ? undefined : 'text-slate-500'
              }
            >
              {fullName}
            </MyLink>
          ) : (
            fullName
          )}

          {displayCirco && (
            <span className="bg-blue cursor-pointer text-slate-400">
              {' '}
              {circoDepartement}
            </span>
          )}
        </div>

        {displayComPerm && (
          <div className="block h-1/2 w-full overflow-hidden bg-slate-300 px-2 italic text-slate-600">
            {' '}
            {translateFonctionInCom(latestComPerm.fonction, gender)} Com.{' '}
            {getComPermNameWithPrefix(latestComPerm.name_short).replace(
              'développement',
              'dév.',
            )}
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
          nom: 'Nom du groupe', // TODO this should not be needed
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
  }

  return (
    <DeputeItem
      {...{ legislature, displayCirco, className }}
      depute={deputeOldShape}
    />
  )
}
