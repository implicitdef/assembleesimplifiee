import Image from 'next/image'

import { LegislatureNavigation } from '../../components/LegislatureNavigation'
import { LATEST_LEGISLATURE } from '../../lib/hardcodedData'
import * as types from './DeputeFiche.types'
import { StatsGraph } from './lib/StatsGraph'
import { InformationsBlock } from './lib/variousBlocks'

export function Page(props: types.Props) {
  const { deputeData, legislature, legislatureNavigationUrls } = props

  const { uid, full_name } = deputeData.depute

  return (
    <div className="">
      <LegislatureNavigation
        title={`Fiche de ${full_name}`}
        currentLegislature={legislature}
        urlsByLegislature={legislatureNavigationUrls}
      />

      <div className="grid grid-cols-12 gap-4">
        <div
          className="col-span-2 flex 
    h-full items-center justify-center"
        >
          <Image
            className="shadow-lg"
            src={`/deputes/photos/${LATEST_LEGISLATURE}/${uid.substring(
              2,
            )}.jpg`}
            alt={`Photo du (de la) député(e)} ${full_name}`}
            width={150}
            height={192}
          />
        </div>
        <div className="col-span-10">
          <InformationsBlock {...props} />
        </div>
      </div>

      {deputeData.stats && (
        <div className="col-span-full my-4 h-44 bg-slate-200 p-4 pb-8">
          <h2 className="text-center text-xl font-bold">
            Présences à l'Assemblée
          </h2>
          <StatsGraph stats={deputeData.stats} />
        </div>
      )}
    </div>
  )
}
