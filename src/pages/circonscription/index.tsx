import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import Link from 'next/link'
import { Todo } from '../../components/Todo'

type Data = {}

export const getServerSideProps: GetServerSideProps<{ data: Data }> = async (
  context,
) => {
  return {
    props: {
      data: {},
    },
  }
}

export default function Page({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <Todo>
      Carte de tous les départements, avec lien vers chaque département (ex:{' '}
      <Link href="/circonscription/departement/Bouches-du-Rhône">
        <a className="font-bold underline">
          /circonscription/departement/Bouches-du-Rhône
        </a>
      </Link>
      )
    </Todo>
  )
}
