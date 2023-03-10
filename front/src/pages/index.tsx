import type { NextPage } from 'next'
import { ReactNode } from 'react'
import { TitleAndDescription } from '../components/TitleAndDescription'

const Home: NextPage = () => {
  return (
    <div className="flex h-full items-center justify-center">
      <TitleAndDescription description="Site d'information et de vulgarisation sur les députés et l'Assemblée nationale. Nous expliquons ce que font les députés, leur rôles, leur circonscriptions, ou ce que sont les groupes ou les commissions." />
      <div className="bg-blXue-400 max-w-4xl  space-y-4 text-justify">
        <div className="mb-10 flex items-center justify-center border-8 border-double border-slate-800 px-1  pb-6 pt-5">
          <div className="mx-4 flex w-fit flex-col items-center justify-center">
            <h1 className="text-left text-4xl font-bold leading-none md:text-5xl">
              Assemblee Simplifiee.com{' '}
            </h1>
            <p className=" text-left">
              Site d'information et de vulgarisation sur le fonctionnement de
              l'Assemblée Nationale.
            </p>
          </div>
        </div>
        <Title>C'est quoi l'Assemblée ?</Title>
        <Paragraph>
          L'Assemblée Nationale, en France, est une institution qui écrit et
          vote les lois, en collaboration avec le gouvernement.
        </Paragraph>
        <Paragraph>
          Elle est composée de 577 députés élus, assistés par un personnel de
          3300 personnes environ, fonctionnaires et collaborateurs
          parlementaires. Leur travail est centré à Paris, dans le Palais
          Bourbon et plusieurs immeubles aux alentours. Mais les députés font
          généralement des aller-retours toutes les semaines dans leur
          circonscription.
        </Paragraph>
        <Paragraph>
          Les députés sont élus tous les cinq ans lors des{' '}
          <span className="italic">élections législatives</span>. Ces élections
          ont lieu quelques semaines après le second tour de l'élection
          présidentielle. Sans surprise, les électeurs ont donc tendance à élire
          une majorité de députés de la même tendance politique que le
          président.
        </Paragraph>
        <Paragraph>
          L'Assemblée joue aussi le rôle d'une "scène de théâtre" pour la vie
          politique française. Les débats dans l'hémicycle, filmés, donnent la
          parole à tous les bords politiques. Les journalistes interviewent
          souvent les députés à la sortie des séances. Les prises de paroles
          pendant le débat, et les commentaires aux journalistes, sont un outil
          majeur pour les députés pour essayer de se faire connaître
          médiatiquement.
        </Paragraph>
        <Title>Que font les députés ?</Title>
        <Paragraph>
          Le rôle premier des députés est d'écrire les lois et de contrôler ce
          que fait le gouvernement. Dans la pratique les députés sont libres de
          faire ce qu'ils veulent pendant leur mandat. Ils ont une enveloppe
          pour recruter une équipe de collaborateurs et un budget de "frais de
          mandats" qu'ils peuvent utiliser très librement.
        </Paragraph>{' '}
        <Paragraph>
          La plupart des députés font des allers-retours toutes les semaines
          entre l'Assemblée, où ils travaillent sur les lois, et leur
          circonscription, où ils rencontrent un maximum de citoyens,
          d'entreprises, d'associations, à un rythme effrené. Cela leur permet
          de connaître les attentes des électeurs, mais aussi d'avancer leur
          carrière politique en se faisant connaître et en accumulant un réseau.
        </Paragraph>
        {/* <Title>Comment se répartissent les députés ?</Title>
        <Paragraph>
          Les députés se regroupent par groupes de 15 députés ou plus, suivant
          leurs affinités politiques. On appelle cela les{' '}
          <span className="italic">groupes parlementaires</span>. Ce sont un peu
          comme des partis, mais internes à l'Assemblée.
        </Paragraph>
        <Paragraph>
          Ils n'ont pas forcément le même nom qu'un parti politique. Par exemple
          les députés .
        </Paragraph>
        <Paragraph>
          Faire partie d'un groupe donne plusieurs avantages, notamment du temps
          de parole dans les débats. Les députés rejoignent presque tous un
          groupe. Les quelques-uns qui ne le font pas sont appelés les{' '}
          <span className="italic">non-inscrits</span>.
        </Paragraph>
        <Paragraph>
          {' '}
          Dans un même groupe, les députés d'un même groupe votent généralement
          de la même manière. Ils n'y sont pas obligés, mais risquent de se
          faire exclure du groupe par leur collègues s'ils se rebellent.
        </Paragraph> */}
      </div>
    </div>
  )
}

function Title({ children }: { children: ReactNode }) {
  return <h2 className="text-left text-3xl font-bold uppercase">{children}</h2>
}

function Paragraph({ children }: { children: ReactNode }) {
  return <p className="">{children}</p>
}

export default Home
