import { InferGetStaticPropsType } from 'next'
import * as render from '../pageModules/stats/Stats.render'
import * as server from '../pageModules/stats/Stats.server'

export const getStaticProps = server.getStaticProps

export default function Page(
  props: InferGetStaticPropsType<typeof getStaticProps>,
) {
  return <render.Page {...props} />
}
