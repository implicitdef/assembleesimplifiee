import { InferGetStaticPropsType } from 'next'
import * as render from '../pageModules/groupesDoc/GroupesDoc.render'
import * as server from '../pageModules/groupesDoc/GroupesDoc.server'

export const getStaticProps = server.getStaticProps

export default function Page(
  props: InferGetStaticPropsType<typeof getStaticProps>,
) {
  return <render.Page {...props} />
}
