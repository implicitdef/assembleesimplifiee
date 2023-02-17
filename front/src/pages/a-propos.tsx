import type { NextPage } from 'next'
import Script from 'next/script'
import { useEffect, useState } from 'react'
import { MyLink } from '../components/MyLink'
import { TitleAndDescription } from '../components/TitleAndDescription'

function useEmailAdress() {
  const [address, setAddress] = useState(
    'con.tu.tact.aro.assem.tu.blee.tu.simplifiee.tu..com',
  )
  const [displayable, setDisplayable] = useState(false)
  useEffect(() => {
    setTimeout(() => {
      setAddress(_ => _.replaceAll('.tu.', '').replaceAll('.aro.', '@'))
      setDisplayable(true)
    }, 10)
  })
  return [address, displayable]
}

const Home: NextPage = () => {
  const [address, addressIsDisplayable] = useEmailAdress()
  return (
    <div className="flex h-full items-center justify-center">
      <TitleAndDescription
        title="À propos"
        description="AssembleeSimplifiee.com est un site d'information et de vulgarisation
          sur le fonctionnement de l'Assemblée nationale française, et sur les députés."
      />

      <div className="m-4 max-w-2xl border border-slate-800">
        <h1 className="m-4 text-center text-2xl  font-bold">À propos</h1>
        <p className="m-4">
          AssembleeSimplifiee.com est un site d'information et de vulgarisation
          sur le fonctionnement de l'Assemblée Nationale française.
        </p>
        <h1 className="m-4 text-xl font-bold">Qui sommes-nous ?</h1>
        <p className="m-4">
          Nous sommes des citoyens français bénévoles. Nous ne travaillons pas
          pour l'Assemblée et nous ne sommes pas rémunérés d'aucune façon.
        </p>
        <h1 className="m-4 text-xl font-bold">D'où viennent les données ?</h1>
        <p className="m-4">
          La plupart des données (identité des députés, leurs rôles, les dates,
          etc.) viennent des données ouvertes publiées par l'Assemblée Nationale
          : <QuickExternalLink url={`https://data.assemblee-nationale.fr`} />.
        </p>

        <p className="m-4">
          Les données de présence des députés (les graphes) viennent de
          l'excellent travail de l'association RegardsCitoyens (
          <QuickExternalLink url={'https://www.regardscitoyens.org'} />
          ), qui les affichent sur leur site{' '}
          <QuickExternalLink url={`https://www.nosdeputes.fr`} />. Ces données
          sont sous licence{' '}
          <QuickExternalLink
            url={`http://opendefinition.org/licenses/odc-odbl`}
            text="ODBL"
          />
          .
        </p>
        <p className="m-4">
          Les cartes des départements et des circonscriptions viennent également
          de Regards Citoyens. Elles sont aussi sous licence ODBL.
        </p>
        <h1 className="m-4 text-xl font-bold">Nous contacter</h1>
        <p className="m-4">
          Par email :{' '}
          {addressIsDisplayable && (
            <MyLink href={`mailto:${address}`}>{address}</MyLink>
          )}
        </p>
        <h1 className="m-4 text-xl font-bold">
          Vie privée et données personnelles
        </h1>
        <p className="m-4">
          Ce site tracke les visites des utilisateurs mais de manière anonyme,
          en suivant les{' '}
          <QuickExternalLink
            url="https://www.cnil.fr/fr/cookies-et-autres-traceurs/regles/cookies-solutions-pour-les-outils-de-mesure-daudience"
            text="recommandations de la CNIL"
          />{' '}
          pour être exempté d'avoir à recueillir le consentement de
          l'internaute.
        </p>

        <p className="m-4">
          Si vous souhaitez désactiver ce tracking, l'interface ci-dessous
          devrait vous permettre de le faire :
        </p>
        <div id="matomo-opt-out" className="m-6 border border-dashed"></div>
        <Script src="https://assembleesimplifiee.matomo.cloud/index.php?module=CoreAdminHome&action=optOutJS&divId=matomo-opt-out&language=auto&backgroundColor=FFFFFF&fontColor=000000&fontSize=12px&fontFamily=Arial&showIntro=1" />
      </div>
    </div>
  )
}

function QuickExternalLink({ url, text }: { url: string; text?: string }) {
  return (
    <MyLink href={url} targetBlank>
      {text ?? url}
    </MyLink>
  )
}

export default Home
