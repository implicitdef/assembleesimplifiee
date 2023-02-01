import groupBy from 'lodash/groupBy'
import sortBy from 'lodash/sortBy'
import { Fragment } from 'react'
import { NewDeputeItem } from '../../components/DeputeItem'
import { LegislatureNavigation } from '../../components/LegislatureNavigation'
import { getComPermFullName } from '../../lib/hardcodedData'
import * as types from './ComPermList.types'

export function ChunkOfDeputes({
  deputes,
  legislature,
}: {
  deputes: (types.DeputeWithCom | types.DeputeWithoutCom)[]
  legislature: number
}) {
  if (deputes.length === 0) return null

  const deputesSorted = sortBy(deputes, _ => {
    const fonction = _.com_perm_fonction
    const score =
      fonction === 'Président'
        ? 1
        : fonction === 'Vice-Président'
        ? 2
        : fonction === 'Rapporteur général'
        ? 3
        : fonction === 'Secrétaire'
        ? 4
        : fonction === 'Membre'
        ? 5
        : 10
    return `${score}_${_.group_acronym}`
  })

  return (
    <>
      <div className="my-4 flex flex-wrap gap-2">
        {deputesSorted.map(depute => {
          return (
            <NewDeputeItem
              key={depute.uid}
              {...{ legislature, depute }}
              className="grow"
            />
          )
        })}
      </div>
    </>
  )
}

export function Page({
  deputesWithCom,
  deputesWithoutCom,
  legislature,
  legislatureNavigationUrls,
}: types.Props) {
  const deputesWithComGroupedByCom = Object.values(
    groupBy(deputesWithCom, _ => _.com_perm_name),
  )

  return (
    <div>
      <LegislatureNavigation
        title="Commissions permanentes"
        currentLegislature={legislature}
        urlsByLegislature={legislatureNavigationUrls}
      />

      <p>Petit texte d'explication des commissions permanentes</p>
      {deputesWithComGroupedByCom.map(deputesSameCom => {
        const comName = deputesSameCom[0].com_perm_name
        return (
          <Fragment key={comName ?? 'none'}>
            <h2 className="m-2 text-4xl font-extrabold">
              {getComPermFullName(comName)}
            </h2>
            <ChunkOfDeputes deputes={deputesSameCom} {...{ legislature }} />
          </Fragment>
        )
      })}
      {deputesWithoutCom.length > 0 && (
        <>
          <h2 className="m-2 text-2xl font-extrabold">
            Députés sans commission permanente
          </h2>
          <p>
            Parfois certains députés n'ont pas de commission permanente
            attribuée. Il s'agit généralement d'une situation temporaire, par
            exemple pour les nouveaux arrivants.
          </p>
          <ChunkOfDeputes deputes={deputesWithoutCom} {...{ legislature }} />
        </>
      )}
    </div>
  )
}
