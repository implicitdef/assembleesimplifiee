import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import Link from 'next/link'
import { Todo } from '../components/Todo'
import { DeputeWithGroupe, fetchDeputesWithGroupe } from '../logic/api'

type Data = {
  deputes: DeputeWithGroupe[]
}

export const getServerSideProps: GetServerSideProps<{ data: Data }> = async (
  context,
) => {
  const deputes = (await fetchDeputesWithGroupe()).sort((a, b) =>
    a.nom.localeCompare(b.nom),
  )
  return {
    props: {
      data: {
        deputes,
      },
    },
  }
}

export default function Page({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { deputes } = data
  const deputesEnCoursMandat = deputes.filter((_) => !_.fin_mandat)
  const legislatureNumber = 16 // TODO get from api
  return (
    <div>
      <h1 className="text-2xl">Tous les députés par ordre alphabétique</h1>
      <p>
        Retrouvez ici l'ensemble des {deputes.length} députés de la{' '}
        <Todo inline>num legislature</Todo>ème législature (dont{' '}
        {deputesEnCoursMandat.length} en cours de mandat). Les informations
        relatives aux députés des précédentes législatures restent accessibles
        sur les liens suivants :
        <Todo inline>liens vers les autres législatures</Todo>
      </p>
      <Todo>graphe de la répartition des groupes parlementaire</Todo>

      <ul className="list-none">
        {data.deputes.map((depute) => {
          return (
            <li
              key={depute.id}
              className="my-2 rounded-lg bg-slate-100 p-4 text-center drop-shadow md:max-w-fit"
            >
              <Link href={`/${depute.slug}`}>
                <a className="font-semibold">
                  {depute.nom} {depute.groupe?.acronym}
                  <Todo inline>afficher circo (departement)</Todo>
                </a>
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
