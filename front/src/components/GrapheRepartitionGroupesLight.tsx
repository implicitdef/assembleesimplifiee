import { sortGroupes } from '../lib/hardcodedData'
import { pickTextColor } from '../lib/utils'

export type Props = {
  groupesData: GroupData[]
  forCommission?: boolean
}

export type GroupData = {
  acronym: string
  nbDeputes: number
  deputesShareOfTotal: number
  color: string
}

export function GrapheRepartitionGroupesLight({
  groupesData,
  forCommission,
}: Props) {
  // return <DottedGraph {...{ groupesData }} />

  return (
    <div
      className={`m-2 flex flex-row shadow-lg ${
        forCommission ? 'h-6' : 'h-48'
      }`}
    >
      {sortGroupes(groupesData).map(g => {
        return (
          <div
            key={g.acronym}
            className={` flex  cursor-default items-center justify-center overflow-hidden text-center leading-4 ${pickTextColor(
              g.color,
            )} ${forCommission ? 'text-sm' : 'text-md'}`}
            style={{
              background: g.color,
              width: `${g.deputesShareOfTotal * 100}%`,
              writingMode: 'vertical-rl',
              textOrientation: 'upright',
            }}
          >
            {forCommission || g.acronym}
          </div>
        )
      })}
    </div>
  )
}

// export function GrapheRepartitionLegend({
//   groupesData,
// }: {
//   groupesData: GroupData[]
// }) {
//   return (
//     <ul className="flex list-none flex-wrap items-baseline space-y-4 space-x-4">
//       {groupesData.map(g => (
//         <li key={g.acronym} className="block">
//           <span
//             className={`mx-2 inline-block  py-1 px-2 ${pickTextColor(g.color)}`}
//             style={{
//               background: g.color,
//             }}
//           >
//             {g.acronym}
//           </span>
//           <span className="text-slate-400">{g.nom}</span>
//         </li>
//       ))}
//       <li></li>
//     </ul>
//   )
// }

// Essayer avec cette data viz d'un hémicycle ? https://flourish.studio/blog/visualize-elections-2022/
// voir si c'est payant ou pas et si je peux le pomper

// Envisager aussi waffle chart https://datavizstory.com/waffle-chart/

// lire ça https://www.flerlagetwins.com/2020/01/parliament-chart.html

// Attempt to make a dotted graph. Interesting but needs a lot of a work. Maybe with CSS grid ? maybe needs some dataviz ?
function DottedGraph({ groupesData }: Props) {
  return (
    <div className="my-2 space-y-1">
      {groupesData.map(g => {
        return (
          <div
            key={g.acronym}
            className="flex flex-row flex-wrap gap-0"
            style={
              {
                // background: g.color,
                // width: `${g.deputesShareOfTotal * 100}%`,
                // order: groupesDisplayOrder.indexOf(g.acronym) ?? 0,
              }
            }
          >
            {g.acronym}
            {Array(g.nbDeputes)
              .fill(0)
              .map((_, idx) => {
                return (
                  <div
                    key={g.acronym + idx}
                    style={{
                      background: g.color,
                    }}
                    className="h-2 w-2 rounded-lg"
                  ></div>
                )
              })}
          </div>
        )
      })}
    </div>
  )
}

// Attempt to make a dotted graph. Interesting but needs a lot of a work. Maybe with CSS grid ? maybe needs some dataviz ?
function DottedGraph2({ groupesData }: Props) {
  return (
    <div className="m-2 flex flex-row flex-wrap ">
      {groupesData.map(g => {
        return (
          <div
            key={g.acronym}
            className="flex flex-row flex-wrap gap-1"
            style={{
              // background: g.color,
              width: `${g.deputesShareOfTotal * 100}%`,
              // order: groupesDisplayOrder.indexOf(g.acronym) ?? 0,
            }}
          >
            {Array(g.nbDeputes)
              .fill(0)
              .map((_, idx) => {
                return (
                  <div
                    key={g.acronym + idx}
                    style={{
                      background: g.color,
                    }}
                    className="h-3 w-3 rounded-lg"
                  ></div>
                )
              })}
          </div>
        )
      })}
    </div>
  )
}
