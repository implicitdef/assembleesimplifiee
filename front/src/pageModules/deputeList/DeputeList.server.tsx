import { GetStaticPaths, GetStaticProps } from 'next'
import { dbReleve } from '../../lib/dbReleve'
import { FIRST_LEGISLATURE_FOR_DEPUTES } from '../../lib/hardcodedData'
import {
  buildLegislaturesNavigationUrls,
  buildStaticPaths,
  readLegislatureFromContext,
} from '../../lib/routingUtils'
import * as types from './DeputeList.types'

const basePath = '/deputes'
const firstLegislature = FIRST_LEGISLATURE_FOR_DEPUTES

export const getStaticPaths: GetStaticPaths<types.Params> = () => {
  return buildStaticPaths(firstLegislature)
}

export const getStaticProps: GetStaticProps<
  types.Props,
  types.Params
> = async context => {
  const legislature = readLegislatureFromContext(context)
  const legislatureNavigationUrls = buildLegislaturesNavigationUrls(
    firstLegislature,
    basePath,
  )

  const deputes = await dbReleve
    .selectFrom('deputes_in_legislatures')
    .where('legislature', '=', legislature)
    .selectAll()
    .execute()

  console.log(deputes.map(_ => _.date_fin))  


  return {
    props: {
      legislature,
      legislatureNavigationUrls,
      deputes,
    },
  }
}
