import { GroupeBadgeWithFonction } from './GroupeBadge'
import { MyLink } from './MyLink'
import { FonctionInGroupe } from '../lib/newAddLatestGroup'
import { LATEST_LEGISLATURE } from '../lib/hardcodedData'
import Image from 'next/image'

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
}

export function DeputeItem({
  depute: {
    uid,
    slug,
    latestGroup,
    fullName,
    circo_departement: circoDepartement,
    mandat_ongoing: mandatOngoing,
  },
  legislature,
  displayCirco,
}: Props) {
  const bg = mandatOngoing ? 'bg-slate-100' : 'bg-slate-200'
  return (
    <div className={`my-2 grow rounded p-2 drop-shadow ${bg}`}>
      <GroupeBadgeWithFonction groupe={latestGroup} marginLeft={false} />
      <>
        {slug ? (
          <MyLink
            href={`/${slug}${
              legislature !== LATEST_LEGISLATURE ? `/${legislature}` : ''
            }`}
            className={
              mandatOngoing
                ? 'font-normal'
                : 'font-normal text-slate-500 line-through'
            }
          >
            {fullName}
          </MyLink>
        ) : (
          fullName
        )}
      </>
      {displayCirco && (
        <span className="bg-blue ml-1 cursor-pointer text-slate-400">
          {circoDepartement}
        </span>
      )}
    </div>
  )
}
