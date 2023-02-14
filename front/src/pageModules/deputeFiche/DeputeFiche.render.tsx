import Image from 'next/image'

import sortBy from 'lodash/sortBy'
import { LATEST_LEGISLATURE } from '../../lib/hardcodedData'
import * as types from './DeputeFiche.types'
import { StatsGraph } from './lib/StatsGraph'
import { InformationsBlock } from './lib/variousBlocks'

export function Page(props: types.Props) {
  const { deputeData } = props

  const { dataInLegislatures, nosDeputesUrl } = deputeData

  const deputesSorted = sortBy(dataInLegislatures, _ => -_[0]).map(_ => _[1])

  const latestDeputeData = deputesSorted[0]

  const legislatures = deputesSorted.map(_ => _.depute.legislature)
  const { uid, full_name, gender } = latestDeputeData.depute
  const fem = gender === 'F'
  const femE = fem ? 'e' : ''
  return (
    <div className="">
      <h1 className="mx-auto w-fit border-8 border-double border-black px-14 py-4 text-center text-4xl font-bold uppercase">
        Fiche de {full_name}
      </h1>

      {deputesSorted.map(deputeData => {
        return (
          <div key={deputeData.depute.legislature}>
            <div className="flex gap-4">
              <Image
                className="self-start border-4 border-black"
                src={`/deputes/photos/${LATEST_LEGISLATURE}/${uid.substring(
                  2,
                )}.jpg`}
                alt={`Photo ${fem ? 'de la' : 'du'} député${femE} ${full_name}`}
                width={150}
                height={192}
              />
              <InformationsBlock
                {...{ deputeData, nosDeputesUrl, legislatures }}
              />
            </div>

            {deputeData.stats && (
              <div className=" my-4 h-44 p-4 pb-8">
                <h2 className="text-center text-xl font-bold">
                  Présences à l'Assemblée
                </h2>
                <StatsGraph stats={deputeData.stats} />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
