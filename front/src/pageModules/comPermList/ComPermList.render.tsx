import groupBy from 'lodash/groupBy'
import sortBy from 'lodash/sortBy'
import { Fragment } from 'react'
import { NewDeputeItem } from '../../components/DeputeItem'
import { LegislatureNavigation } from '../../components/LegislatureNavigation'
import { getComPermFullName } from '../../lib/hardcodedData'
import { newPartitionDeputesByGroup } from '../../lib/utils'
import * as types from './ComPermList.types'

function ChunkOfDeputes({
  deputes,
  legislature,
}: {
  deputes: (types.DeputeWithCom | types.DeputeWithoutCom)[]
  legislature: number
}) {
  if (deputes.length === 0) return null

  return (
    <>
      <div className="my-4 flex flex-wrap gap-2">
        {deputes.map(depute => {
          return (
            <NewDeputeItem
              key={depute.uid}
              {...{ legislature, depute }}
              className="grow"
              displayCirco
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

      <div className="max-w-3xl space-y-2 text-justify">
        <h2 className="text-2xl font-bold">
          C'est quoi les commissions permanentes ?
        </h2>
        <p>
          Pour travailler plus efficacement, les députés sont partagés en huit
          groupes de travail principaux, les{' '}
          <span className="italic">commissions permanentes</span>, qui vont
          dégrossir les projets et propositions de loi avant qu'ils n'arrivent
          devant l'ensemble des députés en hémicycle.
        </p>
        <p>
          Elles sont dites <span className="italic">permanentes</span> par
          rapport à d'autres commissions qui peuvent être créées ponctuellement
          pour un besoin précis.
        </p>
        <p>
          Chaque député appartient à une et une seule commission permanente. Les
          commissions sont des versions miniatures de l'hémicycle : la
          proportion de députés de chaque groupe dans l'hémicycle est reproduite
          dans chaque commission. On retrouve la même majorité, la même
          opposition.
        </p>
      </div>
      {deputesWithComGroupedByCom.map(deputesSameCom => {
        const comName = deputesSameCom[0].com_perm_name

        const deputesImportants = deputesSameCom.filter(
          _ => _.com_perm_fonction !== 'Membre',
        )

        const deputesImportantsSorted = sortBy(deputesImportants, _ => {
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

        const deputeImportantsIds = deputesImportants.map(_ => _.uid)
        const membres = deputesSameCom.filter(
          _ => !deputeImportantsIds.includes(_.uid),
        )

        const deputesMaj = membres.filter(
          _ => _.group_pos === 'maj' || _.group_pos === 'min',
        )
        const deputesOpp = membres.filter(_ => _.group_pos === 'opp')
        const deputesWithoutPos = membres.filter(_ => !_.group_pos)

        const res = [deputesMaj, deputesOpp, deputesWithoutPos]
          .map(newPartitionDeputesByGroup)
          .map(_ =>
            _.map(_ =>
              sortBy(_, _ => {
                const fonction = _.group_fonction
                const score =
                  fonction === 'Président'
                    ? 100
                    : fonction === 'Membre'
                    ? 50
                    : 10
                return -score
              }),
            ),
          )
          .map(_ => _.flat())
          .flat()

        return (
          <Fragment key={comName ?? 'none'}>
            <h2 className="mb-2 mt-6 text-2xl font-bold">
              {getComPermFullName(comName)}
            </h2>
            <ChunkOfDeputes
              deputes={deputesImportantsSorted}
              {...{ legislature }}
            />

            <ChunkOfDeputes deputes={res} {...{ legislature }} />
          </Fragment>
        )
      })}
      {deputesWithoutCom.length > 0 && (
        <>
          <h2 className="my-2 text-2xl font-bold">
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
