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
  },
  legislature,
  displayCirco,
  className,
}: Props) {
  const bg = mandatOngoing ? 'bg-slate-100' : 'bg-slate-200'
  const borderSize = latestGroup ? `border-2 ` : ''
  return (
    <div
      className={`flex min-h-[52px] flex-row rounded drop-shadow ${borderSize} ${bg} ${className}`}
      style={latestGroup ? { borderColor: latestGroup.color } : {}}
    >
      <GroupeBadgeWithFonction groupe={latestGroup} marginLeft={false} />
      <div className="flex h-full w-full flex-col items-start justify-center">
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

        {latestComPerm &&
          latestComPerm.fonction !== 'Membre' &&
          latestComPerm.name_short && (
            <div className=" mx-1 mb-1  bg-slate-400 px-1 italic text-slate-200">
              {' '}
              {latestComPerm.fonction} com.{' '}
              {getComPermNameWithPrefix(latestComPerm.name_short)}
            </div>
          )}
      </div>
    </div>
  )
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
  }

  return (
    <DeputeItem
      {...{ legislature, displayCirco, className }}
      depute={deputeOldShape}
    />
  )
}
