import { pickTextColor } from '../lib/utils'
import { MyLink } from './MyLink'

export type Props = {
  groupesData: GroupData[]
}

export type GroupData = {
  acronym: string
  deputesShareOfTotal: number
  color: string
}

export function GrapheRepartitionGroupesLight({ groupesData }: Props) {
  return (
    <div className="m-2 flex h-10 flex-row shadow-lg">
      {groupesData.map(g => {
        return (
          <div
            key={g.acronym}
            className={`flex cursor-default items-center justify-center overflow-hidden text-center ${pickTextColor(
              g.color,
            )}`}
            style={{
              background: g.color,
              width: `${g.deputesShareOfTotal * 100}%`,
              // order: groupesDisplayOrder.indexOf(g.acronym) ?? 0,
            }}
          >
            {g.acronym}
          </div>
        )
      })}
    </div>
  )
}
