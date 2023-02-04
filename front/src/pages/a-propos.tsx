import type { NextPage } from 'next'
import { MyLink } from '../components/MyLink'

const Home: NextPage = () => {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="m-4 max-w-2xl rounded-xl bg-slate-200">
        <h1 className="m-4 text-center text-2xl  font-extrabold">À propos</h1>
        <p className="m-4">
          AssembleeSimplifiee.com est un site d'information et de vulgarisation
          sur le fonctionnement de l'Assemblée Nationale française.
        </p>
        <h1 className="m-4 text-xl font-extrabold">Qui sommes-nous ?</h1>
        <p className="m-4">
          Nous sommes des citoyens français bénévoles. Nous ne travaillons pas
          pour l'Assemblée et nous ne sommes pas rémunérés d'aucune façon.
        </p>
        <h1 className="m-4 text-xl font-extrabold">
          D'où viennent les données ?
        </h1>
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
