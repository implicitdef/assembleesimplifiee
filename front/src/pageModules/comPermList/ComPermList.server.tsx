import { GetStaticPaths, GetStaticProps } from 'next'
import { dbReleve } from '../../lib/dbReleve'
import { FIRST_LEGISLATURE_FOR_DEPUTES } from '../../lib/hardcodedData'
import {
  buildLegislaturesNavigationUrls,
  buildStaticPaths,
  readLegislatureFromContext,
} from '../../lib/routingUtils'
import * as types from './ComPermList.types'

const basePath = '/commissions-permanentes'

const firstLegislature = FIRST_LEGISLATURE_FOR_DEPUTES

export const getStaticPaths: GetStaticPaths<types.Params> = () => {
  return buildStaticPaths(firstLegislature)
}

function isWithoutCom(depute: types.Depute): depute is types.DeputeWithoutCom {
  return depute.com_perm_uid === null
}
function isWithCom(depute: types.Depute): depute is types.DeputeWithCom {
  return depute.com_perm_uid !== null
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
    .where('ongoing', '=', true)
    .where('legislature', '=', legislature)
    .selectAll()
    .execute()

  const deputesWithCom = deputes.filter(isWithCom)
  const deputesWithoutCom = deputes.filter(isWithoutCom)

  return {
    props: {
      legislature,
      legislatureNavigationUrls,
      deputesWithCom,
      deputesWithoutCom,
    },
  }
}
