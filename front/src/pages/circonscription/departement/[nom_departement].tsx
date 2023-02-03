import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next'
import Image from 'next/image'
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

const beautifyNumeroCirconsription = (num: number) => {
  if (num === 1) return '1ère'
  return `${num}ème`
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
  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-full text-center">
        <div className="mx-auto my-4 w-[52rem] rounded-xl bg-slate-200 p-5">
          <h1 className="text-center text-4xl font-extrabold">
            {nom} ({id})
          </h1>
        </div>
      </div>

      <div className="col-span-5 pl-10">
        {deputes.map(depute => {
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
              <NewDeputeItem
                {...{ depute }}
                legislature={LATEST_LEGISLATURE}
                displayCirco
              />
              {beautifyNumeroCirconsription(depute.circo_num)} circonscription
            </div>
          )
        })}
      </div>
      <div className="col-span-7 ">
        <div className="bg-slate-200  px-8 py-4 shadow-md">
          <div className="py-4">
            <MapDepartement
              id={id}
              circonscription={circonscription}
              onHover={onCirconscriptionHover}
              onClick={onCirconscriptionClick}
              ouMouseOut={onCirconscriptionMouseOut}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
