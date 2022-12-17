import range from 'lodash/range'
import { GetServerSideProps } from 'next'
import {
  FIRST_LEGISLATURE_FOR_REUNIONS_AND_SESSIONS,
  LATEST_LEGISLATURE,
} from '../../lib/hardcodedData'
import { querySessions } from '../../lib/querySessions'
import * as types from './SessionList.types'

type Query = {
  legislature?: string
}

export const getServerSideProps: GetServerSideProps<{
  data: types.Props
}> = async context => {
  const query = context.query as Query
  const legislatureInPath = query.legislature
    ? parseInt(query.legislature, 10)
    : null
  if (legislatureInPath === LATEST_LEGISLATURE) {
    return {
      redirect: {
        permanent: false,
        destination: `/sessions`,
      },
    }
  }
  const legislature = legislatureInPath ?? LATEST_LEGISLATURE
  const legislatureNavigationUrls = range(
    FIRST_LEGISLATURE_FOR_REUNIONS_AND_SESSIONS,
    LATEST_LEGISLATURE + 1,
  ).map(l => {
    const tuple: [number, string] = [
      l,
      `/sessions${l !== LATEST_LEGISLATURE ? `/${l}` : ''}`,
    ]
    return tuple
  })

  const sessions = await querySessions(legislature)

  return {
    props: {
      data: {
        legislature,
        legislatureNavigationUrls,
        sessions,
      },
    },
  }
}
