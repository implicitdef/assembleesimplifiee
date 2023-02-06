import type { NextPage } from 'next'

const Home: NextPage = () => {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="m-4 max-w-4xl space-y-4 rounded-xl bg-slate-200 py-10 px-4 text-justify">
        <h1 className="mb-4 text-center text-4xl font-extrabold">
          AssembleeSimplifiee.com
        </h1>
        <p className="text-center">
          Site d'information et de vulgarisation sur le fonctionnement de
          l'Assemblée Nationale.
        </p>
        <h1 className="m-4 text-center text-2xl font-extrabold">
          C'est quoi l'Assemblée ?
        </h1>
        <p className="">
          L'Assemblée Nationale, en France, est une institution qui écrit et
          vote les lois, en collaboration avec le gouvernement.
        </p>

        <p className="">
          L'Assemblée joue aussi le rôle d'une "scène de théâtre" pour la vie
          politique française. Les débats dans l'hémicycle, filmés, donnent la
          parole à tous les bords politiques. Les journalistes interviewent
          souvent les députés à la sortie des séances. Les prises de paroles
          pendant le débat, et les commentaires aux journalistes, sont un outil
          majeur pour les députés pour essayer de se faire connaître
          médiatiquement.
        </p>

        <p className="">
          Elle est composée de 577 députés élus, assistés par un personnel de
          3300 personnes environ, fonctionnaires et collaborateurs
          parlementaires. Leur travail est centré à Paris, dans le Palais
          Bourbon et plusieurs immeubles aux alentours. Mais les députés font
          généralement des aller-retours toutes les semaines dans leur
          circonscription.
        </p>

        <p className="">
          Les députés sont élus tous les cinq ans lors des{' '}
          <span className="italic">élections législatives</span>. Ces élections
          ont lieu quelques semaines après le second tour de l'élection
          présidentielle. Sans surprise, les électeurs ont donc tendance à élire
          une majorité de députés de la même tendance politique que le
          président.
        </p>

        {/* <p className="">
          En théorie, le rôle premier des députés est d'écrire les lois et de
          contrôler ce que fait le gouvernement. Dans la pratique les députés
          sont libres de faire ce qu'ils veulent pendant leur mandat. Ils ont
          une enveloppe pour recruter une équipe de collaborateurs et un budget
          de "frais de mandats" qu'ils peuvent utiliser très librement.
          <br /> La plupart des députés font des allers-retours toutes les
          semaines entre l'Assemblée, pour travailler sur les lois, et leur
          circonscription où ils rencontrent un maximum de citoyens,
          d'entreprises, d'associations, à un rythme effrené. Cela leur permet
          de connaître les attentes des électeurs, mais aussi d'avancer leur
          carrière politique en se faisant connaître et en accumulant un réseau.
        </p> */}
      </div>
    </div>
  )
}

export default Home
