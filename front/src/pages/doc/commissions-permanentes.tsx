import { InferGetStaticPropsType } from 'next'
import * as render from '../../pageModules/comPermDoc/ComPermDoc.render'
import * as server from '../../pageModules/comPermDoc/ComPermDoc.server'

export const getStaticProps = server.getStaticProps

export default function Page(
  props: InferGetStaticPropsType<typeof getStaticProps>,
) {
  return <render.Page {...props} />
}
