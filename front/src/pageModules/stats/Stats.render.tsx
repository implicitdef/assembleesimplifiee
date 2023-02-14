import { DeputeItem, NewDeputeItem } from '../../components/DeputeItem'
import { LazyRender } from '../../lib/LazyRender'
import { getOrdinalSuffixFeminine } from '../../lib/utils'
import { StatsGraph } from '../deputeFiche/lib/StatsGraph'
import * as types from './Stats.types'

export function Page({ stats }: types.Props) {
  return (
    <div>
      <h1 className="mx-auto mb-10 w-fit border-8 border-double border-black px-14 py-4 text-center text-4xl font-bold uppercase">
        Liste des députés ayant été particulièrement absents
      </h1>
      {stats.map(deputeStats => {
        const { depute, statsByLegislature } = deputeStats

        return (
          <div key={depute.uid}>
            <NewDeputeItem depute={depute} className="w-fit" />
            {statsByLegislature.map(([legislature, stats]) => {
              return (
                <div key={legislature} className="ml-8 mt-2">
                  <h2 className="text-left">
                    Présences détectées lors de la {legislature}
                    {getOrdinalSuffixFeminine(legislature)} législature
                  </h2>
                  <LazyRender className="h-36">
                    <StatsGraph stats={stats} />
                  </LazyRender>
                </div>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}
