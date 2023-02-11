import { FonctionInGroupe } from '../lib/addLatestGroup'
import { pickTextColorForGroupeBadge } from '../lib/utils'

export function GroupeBadge({
  acronym,
  nom,
  fonction,
  color,
  fullName = false,
  className = '',
  withFonction = true,
}: {
  acronym: string
  nom: string
  fonction?: FonctionInGroupe
  color: string
  fullName?: boolean
  className?: string
  withFonction?: boolean
}) {
  const fonctionLabel = withFonction
    ? fonction === 'Président'
      ? 'Président du groupe'
      : fonction === 'Membre apparenté'
      ? 'apparenté'
      : null
    : null
  return (
    <span
      className={`inline-block cursor-default py-1 px-2 ${pickTextColorForGroupeBadge(
        color,
      )} ${className}`}
      style={{ background: color }}
    >
      <div className="flex h-full items-center justify-center">
        <p>
          <span>{fullName ? nom : acronym}</span>
          {fonctionLabel ? (
            <>
              {' '}
              <span className={`italic ${pickTextColorForGroupeBadge(color)}`}>
                ({fonctionLabel})
              </span>
            </>
          ) : null}
        </p>
      </div>
    </span>
  )
}
