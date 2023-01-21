import { GroupeBadgeWithFonction } from './GroupeBadge'
import { MyLink } from './MyLink'
import { FonctionInGroupe } from '../lib/newAddLatestGroup'
import { LATEST_LEGISLATURE } from '../lib/hardcodedData'

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
  }
  legislature: number
  displayCirco?: boolean
  className?: string
}

export function DeputeItem({
  depute: {
    slug,
    latestGroup,
    fullName,
    circo_departement: circoDepartement,
    mandat_ongoing: mandatOngoing,
  },
  legislature,
  displayCirco,
  className,
}: Props) {
  const bg = mandatOngoing ? 'bg-slate-100' : 'bg-slate-200'
  return (
    <div className={`rounded drop-shadow ${bg} pr-2 ${className}`}>
      <GroupeBadgeWithFonction groupe={latestGroup} marginLeft={false} />
      <>
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
      </>
      {displayCirco && (
        <span className="bg-blue cursor-pointer text-slate-400">
          {' '}
          {circoDepartement}
        </span>
      )}
    </div>
  )
}
