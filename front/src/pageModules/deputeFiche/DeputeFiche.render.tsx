import Image from 'next/image'

import { LegislatureNavigation } from '../../components/LegislatureNavigation'
import { LATEST_LEGISLATURE } from '../../lib/hardcodedData'
import * as types from './DeputeFiche.types'
import { StatsGraph } from './lib/StatsGraph'
import { InformationsBlock } from './lib/variousBlocks'

export function Page(props: types.Props) {
  const { deputeData, legislature, legislatureNavigationUrls } = props

  const { uid, full_name } = deputeData.depute

  const fem = deputeData.depute.gender === 'F'
  const femE = fem ? 'e' : ''
  return (
    <div className="">
      <LegislatureNavigation
        title={`Fiche de ${full_name}`}
        currentLegislature={legislature}
        urlsByLegislature={legislatureNavigationUrls}
      />

      <div className="flex gap-4">
        <Image
          className="self-start border-4 border-black"
          src={`/deputes/photos/${LATEST_LEGISLATURE}/${uid.substring(2)}.jpg`}
          alt={`Photo ${fem ? 'de la' : 'du'} député${femE} ${full_name}`}
          width={150}
          height={192}
        />
        <InformationsBlock {...props} />
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
}
