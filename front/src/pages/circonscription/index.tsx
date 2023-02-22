import Link from 'next/link'
import { useState } from 'react'
import { MapFrance } from '../../components/MapFrance'
import { TitleAndDescription } from '../../components/TitleAndDescription'
import { departements } from '../../lib/hardcodedData'

type DepartementEntry = [string, string]

function DepartementList({
  departements,
  selected,
  onHover,
  onMouseOut,
}: {
  departements: DepartementEntry[]
  selected?: string
  onHover: Function
  onMouseOut: Function
}) {
  return (
    <div className="mx-2 mt-4 grid grid-flow-row grid-cols-2 gap-y-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5">
      {departements.map(([nom, id]: [nom: string, id: string]) => (
        <div
          key={id}
          style={{
            background: selected === id ? '#deecbd' : '',
            textDecoration: 'underline',
          }}
          onMouseOver={() => onHover(id)}
          onMouseOut={() => onMouseOut(id)}
          className="flex items-center justify-start "
        >
          <Link
            href={`/circonscription/departement/${encodeURIComponent(nom)}`}
            className="overflow-hidden text-ellipsis whitespace-nowrap"
          >
            {nom} ({id})
          </Link>
        </div>
      ))}
    </div>
  )
}

export default function Page() {
  const [departement, setDepartement] = useState<string | undefined>()
  const departementsEntries = Object.entries(departements)
  const onHover = (id: string) => {
    setDepartement(id)
  }
  const onMouseOut = () => {
    setDepartement(undefined)
  }
  const onClick = () => {
    console.log('click')
  }
  return (
    <>
      <TitleAndDescription
        title="Circonscriptions"
        description="Carte de France des circonscriptions électorales, département par département, pour les élections législatives : trouvez votre député"
      />
      <h1 className="my-4 text-center text-4xl font-bold">
        Toutes les circonscriptions par département
      </h1>

      <div className="mt-10 flex flex-col items-center">
        <div className="w-full max-w-[800px]  ">
          <MapFrance
            onHover={onHover}
            onMouseOut={onMouseOut}
            onClick={onClick}
            selected={departement}
          />
        </div>
        <DepartementList
          selected={departement}
          departements={departementsEntries}
          onHover={onHover}
          onMouseOut={onMouseOut}
        />
      </div>
    </>
  )
}
