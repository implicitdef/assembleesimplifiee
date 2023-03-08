import { pickTextColor } from '../lib/utils'

export type Props = {
  groupesData: GroupData[]
}

export type GroupData = {
  acronym: string
  nbDeputes: number
  deputesShareOfTotal: number
  color: string
}

export function GrapheRepartitionGroupesLight({ groupesData }: Props) {
  return <DottedGraph {...{ groupesData }} />
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

function DottedGraph({ groupesData }: Props) {
  return (
    <div className="m-2 flex flex-col flex-wrap gap-1 ">
      {groupesData.map(g => {
        return Array(g.nbDeputes)
          .fill(0)
          .map((_, idx) => {
            return (
              <div
                key={g.acronym + idx}
                style={{
                  background: g.color,
                }}
                className="h-3 w-3 rounded"
              ></div>
            )
          })
      })}
    </div>
  )
}
