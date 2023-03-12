import groupBy from 'lodash/groupBy'
import sortBy from 'lodash/sortBy'
import { Fragment } from 'react'
import { NewDeputeItem } from '../../components/DeputeItem'
import { LegislatureNavigation } from '../../components/LegislatureNavigation'
import { MyLink } from '../../components/MyLink'
import { NiceItalic } from '../../components/textHelpers'
import { TitleAndDescription } from '../../components/TitleAndDescription'
import { getComPermFullName, LATEST_LEGISLATURE } from '../../lib/hardcodedData'
import {
  getOrdinalSuffixFeminine,
  newPartitionDeputesByGroup,
} from '../../lib/utils'
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
              {...{ depute }}
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
  const legiDesc = buildLegislatureDescription(legislature)
  return (
    <div>
      <TitleAndDescription
        title={`Commissions permanentes${legiDesc}`}
        description={`Liste des commissions permanentes${legiDesc} à l'Assemblée nationale, et liste des députés qui en sont membres, avec leur rôles (Président, Vice-président, secrétaire, etc.). Explique ce que sont les commissions permanentes et ce qu'elles font.`}
      />
      <LegislatureNavigation
        title="Les députés par commission permanente"
        currentLegislature={legislature}
        urlsByLegislature={legislatureNavigationUrls}
      />

      <div className="space-y-2 text-left">
        {/* <h2 className="text-2xl font-bold">
          C'est quoi les commissions permanentes ?
        </h2> */}
        <p>
          Les députés sont répartis dans huit groupes de travail principaux, les{' '}
          <NiceItalic>commissions permanentes</NiceItalic>, pour préparer les
          projets de loi avant qu'ils n'arrivent devant l'ensemble des députés.
          Si vous voyez que votre député est dans telle ou telle commission,
          cela peut vous donner une idée (très approximative) du genre de
          problèmatiques sur lesquelles il travaille.
        </p>
        <p>
          Pour plus d'explications sur les commissions permanentes, voir la page{' '}
          <MyLink href="/doc/commissions-permanentes">
            C'est quoi les commissions permanentes ?
          </MyLink>
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

function buildLegislatureDescription(legi: number) {
  return legi === LATEST_LEGISLATURE
    ? ``
    : legi === LATEST_LEGISLATURE - 1
    ? ` de la législature précédente`
    : ` de la ${legi}${getOrdinalSuffixFeminine(legi)} législature`
}
