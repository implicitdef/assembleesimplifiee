import groupBy from 'lodash/groupBy'
import sortBy from 'lodash/sortBy'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { DeputeItem } from '../../components/DeputeItem'
import { db } from '../../repositories/db'
import { FonctionInGroupe } from '../../services/queryDeputesWithAllGroupes'
import {
  fetchDeputesOfGroupe,
  SimpleDepute,
} from '../../services/deputesAndGroupesService'
import { getColorForGroupeAcronym } from '../../services/hardcodedData'

type Data = {
  groupeInfo: {
    nom: string
    acronym: string
  }
  deputes: {
    current: SimpleDepute[]
    former: SimpleDepute[]
  }
}

export const getServerSideProps: GetServerSideProps<{
  data: Data
}> = async context => {
  const acronym = context.query.acronym as string
  const groupeInfo = await db
    .selectFrom('organisme')
    .innerJoin(
      'parlementaire_organisme',
      'parlementaire_organisme.organisme_id',
      'organisme.id',
    )
    .select(['nom', 'parlementaire_groupe_acronyme as acronym'])
    .where('parlementaire_groupe_acronyme', '=', acronym)
    .where('type', '=', 'groupe')
    .executeTakeFirst()
  if (!groupeInfo) {
    return {
      notFound: true,
    }
  }
  const deputes = await fetchDeputesOfGroupe(acronym)
  return {
    props: {
      data: {
        deputes,
        groupeInfo,
      },
    },
  }
}

function GroupOfDeputes({
  title,
  deputes,
}: {
  title: string
  deputes: SimpleDepute[]
}) {
  if (deputes.length === 0) return null
  return (
    <div>
      <h2 className="text-2xl">{title}</h2>
      <ul className="list-none">
        {deputes.map(depute => {
          return (
            <li key={depute.id}>
              <DeputeItem {...{ depute }} withCirco />
            </li>
          )
        })}
      </ul>
    </div>
  )
}

const displayRankOfFonctions: Record<FonctionInGroupe, number> = {
  president: 1,
  membre: 2,
  apparente: 3,
}

export default function Page({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const {
    deputes: { current, former },
    groupeInfo: { nom, acronym },
  } = data

  const groupedByFonction = groupBy(current, _ => _.latestGroup.fonction) as {
    [fonction in FonctionInGroupe]: SimpleDepute[]
  }
  const entries = Object.entries(groupedByFonction) as [
    FonctionInGroupe,
    SimpleDepute[],
  ][]

  const groupedByFonctionAndOrdered = sortBy(
    entries,
    _ => displayRankOfFonctions[_[0]],
  )
  return (
    <div>
      <h1 className="text-center text-2xl">
        Groupe {nom}
        <span
          className={`mx-2 inline-block py-1 px-2 text-white`}
          style={{ background: getColorForGroupeAcronym(acronym) }}
        >
          {acronym}
        </span>
        ({current.length} députés)
      </h1>
      {groupedByFonctionAndOrdered.map(([fonction, deputes]) => {
        if (deputes.length === 0) return null
        const title =
          fonction === 'president'
            ? 'Président(e)'
            : fonction === 'apparente'
            ? 'Apparentés'
            : fonction === 'membre'
            ? 'Membres'
            : fonction
        return <GroupOfDeputes key={fonction} {...{ title, deputes }} />
      })}
      <GroupOfDeputes title="Anciens membres" deputes={former} />
    </div>
  )
}
