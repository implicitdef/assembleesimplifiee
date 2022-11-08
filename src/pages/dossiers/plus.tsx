import { InferGetServerSidePropsType } from 'next'
import * as render from '../../pageModules/dossierListByInterventions/DossierListByInterventions.render'
import * as server from '../../pageModules/dossierListByInterventions/DossierListByInterventions.server'

export const getServerSideProps = server.getServerSideProps

export default function Page({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return <render.Page {...data} />
}
