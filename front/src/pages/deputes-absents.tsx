import { InferGetStaticPropsType } from 'next'
import * as render from '../pageModules/deputesAbsents/DeputesAbsents.render'
import * as server from '../pageModules/deputesAbsents/deputesAbsents.server'

export const getStaticProps = server.getStaticProps

export default function Page(
  props: InferGetStaticPropsType<typeof getStaticProps>,
) {
  return <render.Page {...props} />
}
