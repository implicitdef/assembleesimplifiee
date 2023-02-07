import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { NewDeputeItem } from '../../../components/DeputeItem'
import { MapDepartement } from '../../../components/MapDepartement'
import {
  departements,
  getIdDepartement,
  LATEST_LEGISLATURE,
} from '../../../lib/hardcodedData'
import {
  DeputeInDepartement,
  queryDeputesForDepartement,
} from '../../../lib/queryDeputesForDepartement'
import { getOrdinalSuffixFeminine } from '../../../lib/utils'
import sortBy from 'lodash/sortBy'
type Params = {
  nom_departement: string
}
type Props = {
  departement: {
    nom: string
    id: string
  }
  deputes: DeputeInDepartement[]
}

export const getStaticPaths: GetStaticPaths<Params> = () => {
  const nomDepartments = Object.keys(departements)
  return {
    paths: nomDepartments.map(nom_departement => ({
      params: { nom_departement },
    })),
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps<Props, Params> = async context => {
  if (!context.params) {
    throw new Error('Missing params')
  }
  const nomDepartement = context.params.nom_departement
  const idDepartement = getIdDepartement(nomDepartement)
  const deputes = await queryDeputesForDepartement(nomDepartement)
  return {
    props: {
      deputes,
      departement: {
        nom: nomDepartement,
        id: idDepartement,
      },
    },
  }
}

export default function Page(
  props: InferGetStaticPropsType<typeof getStaticProps>,
) {
  const [circonscription, setCirconscription] = useState<null | string>(null)
  const {
    departement: { nom, id },
    deputes,
  } = props
  const router = useRouter()

  const onCirconscriptionHover = (id: string) => {
    setCirconscription(id)
  }

  const onCirconscriptionClick = (circonscriptionId: string) => {
    const depute = deputes.find(
      depute => depute.circo_num === parseInt(circonscriptionId),
    )
    if (depute) {
      router.push(`/${depute.slug}`)
    }
  }
  const onCirconscriptionMouseOut = (circonscriptionId: string) => {
    setCirconscription(null)
  }

  const isCurrentCirconscription = (circo_number: number) => {
    return (
      circonscription &&
      circo_number === parseInt(circonscription.replace(/^id-\d+-(.*)/, '$1'))
    )
  }
  const onDeputeHover = (depute: DeputeInDepartement) => {
    setCirconscription(depute.circo_num.toString())
  }
  const onDeputeMouseOut = (depute: DeputeInDepartement) => {
    setCirconscription(null)
  }

  const deputesSorted = sortBy(deputes, _ => _.circo_num)
  return (
    <>
      <h1 className="text-center text-4xl font-bold">
        {nom} ({id})
      </h1>
      <div className="mt-8">
        <div className="flex items-center justify-center">
          <div className="h-[350px]  w-[350px] md:h-[450px] md:w-[450px]  lg:h-[600px] lg:w-[600px]">
            <MapDepartement
              id={id}
              circonscription={circonscription}
              onHover={onCirconscriptionHover}
              onClick={onCirconscriptionClick}
              ouMouseOut={onCirconscriptionMouseOut}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-y-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
          {deputesSorted.map(depute => {
            return (
              <div
                key={depute.uid}
                onMouseOver={e => onDeputeHover(depute)}
                onMouseOut={e => onDeputeMouseOut(depute)}
                style={{
                  cursor: 'pointer',
                  marginBottom: 5,
                  display: 'inline-block',
                  listStyleType: 'none',
                  padding: 5,
                  background: isCurrentCirconscription(depute.circo_num)
                    ? '#d1ea7499'
                    : 'initial',
                }}
                className="w-full"
              >
                <h3 className="font-bold">
                  {depute.circo_num}
                  {getOrdinalSuffixFeminine(depute.circo_num)} circonscription
                </h3>
                <NewDeputeItem
                  {...{ depute }}
                  legislature={LATEST_LEGISLATURE}
                  displayCirco
                />
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}
