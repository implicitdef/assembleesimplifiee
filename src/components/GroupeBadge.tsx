import { NormalizedFonction } from '../logic/api'
import { getColorForGroupeAcronym } from '../logic/hardcodedData'

export function GroupeBadgeWithFonction({
  groupe,
}: {
  groupe: { acronym: string; fonction: NormalizedFonction } | null
}) {
  if (groupe)
    return (
      <BaseGroupeBadge acronym={groupe.acronym} fonction={groupe.fonction} />
    )
  else return null
}

export function GroupeBadge({
  groupe,
}: {
  groupe: { acronym: string } | null
}) {
  if (groupe) return <BaseGroupeBadge acronym={groupe.acronym} />
  else return null
}

function BaseGroupeBadge({
  acronym,
  fonction,
}: {
  acronym: string
  fonction?: NormalizedFonction
}) {
  return (
    <span
      className={`mx-2 inline-block py-1 px-2 text-white`}
      style={{ background: getColorForGroupeAcronym(acronym) }}
    >
      {acronym}
      {fonction && fonction !== 'membre' ? ` (${fonction})` : null}
    </span>
  )
}
