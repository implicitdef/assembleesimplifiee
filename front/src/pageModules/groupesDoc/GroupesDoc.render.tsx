import { ReactNode } from 'react'
import { GroupeBadge } from '../../components/GroupeBadge'
import { TitleAndDescription } from '../../components/TitleAndDescription'
import * as types from './GroupesDoc.types'

export function Page({ groupeRN, groupeECOLO, groupeLIOT }: types.Props) {
  return (
    <div className="">
      <TitleAndDescription
        title="Les groupes"
        description="Explication de ce que sont les groupes parlementaires à l'Assemblée Nationale, comment ils regroupent les députés, comment ils fonctionnent"
      />
      <h1 className="mx-auto mb-8 w-fit border-8 border-double border-black px-14 py-4 text-center text-4xl font-bold uppercase">
        Les groupes parlementaires
      </h1>
      <div className="mx-auto max-w-4xl space-y-4">
        <Title>C'est quoi les "groupes" à l'Assemblée?</Title>
        <Paragraph>
          Les députés s'organisent par groupes de 15 députés ou plus, suivant
          leurs affinités politiques. On appelle cela les{' '}
          <span className="font-bold">groupes parlementaires</span>. Ce sont un
          peu comme des partis, mais internes à l'Assemblée.
        </Paragraph>

        <HelperText>
          Ils peuvent avoir le même nom qu'un parti politique, ou pas.
          {groupeRN && groupeECOLO && (
            <ul>
              <li className="list-inside list-disc">
                Par exemple les candidats du parti politique{' '}
                <span className="font-bold">Rassemblement National</span> qui
                ont été élus ont formé à l'Assemblée le groupe
                <QuickBadge groupe={groupeRN} />
              </li>
              <li className="list-inside list-disc">
                A l'inverse, ceux issus d'
                <span className="font-bold">Europe Écologie Les Verts</span> ont
                nommés leur groupe
                <QuickBadge groupe={groupeECOLO} />
              </li>
            </ul>
          )}
        </HelperText>
        <Paragraph>
          Faire partie d'un groupe donne plusieurs avantages, notamment du temps
          de parole dans les débats. Les députés rejoignent presque tous un
          groupe. Les quelques-uns qui ne le font pas sont appelés les{' '}
          <span className="font-bold">non-inscrits</span>.
        </Paragraph>
        <Paragraph>
          Dans un même groupe, les députés votent généralement de la même
          manière. Ils n'y sont pas obligés, mais risquent de se faire exclure
          du groupe par leur collègues s'ils désobéissent.
        </Paragraph>
        <HelperText>
          Les groupes peuvent parfois ne pas correspondre à une ligne politique.
          {groupeLIOT && (
            <>
              {' '}
              Par exemple, le groupe <QuickBadge groupe={groupeLIOT} /> est
              constitué de députés qui ne votent pas toujours pareil, mais ont
              préfèré former un groupe plutôt que d'être non-inscrits.
            </>
          )}
        </HelperText>
        <Title>Les groupes actuels</Title>
        <Title>Les "membres apparentés"</Title>
        <Paragraph>
          Ce sont des députés qui souhaitent être affiliés à un groupe sans en
          faire vraiment partie. C'est une distinction subtile permise par le
          règlement de l'Assemblée.
        </Paragraph>
        <Paragraph>
          Dans la pratique{' '}
          <span className="font-bold">
            cette distinction n'a pas beaucoup d'importance
          </span>
          , tout se passe comme s'ils étaient des membres à part entière. Les
          membres apparentés comptent dans l'effectif du groupe, lorsqu'il
          s'agit d'assigner les postes dans les commissions, ou lors des votes
          dans la Conférence des Présidents.
        </Paragraph>
        <Paragraph>
          La seule différence est que les membres apparentés ne comptent pas
          dans les 15 membres minimum qu'il faut pour constituer (et maintenir)
          un groupe. Par exemple un groupe qui serait composé de 15 membres à
          part entière et de 3 membres apparentés serait menacé de disparition
          si l'un des 15 quittait le groupe.
        </Paragraph>
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

function HelperText({ children }: { children: ReactNode }) {
  return (
    <div className="my-2 mx-6 rounded-xl border border-slate-300 bg-yellow-100 py-2 px-6">
      {children}
    </div>
  )
}

function QuickBadge({ groupe }: { groupe: types.Groupe }) {
  return <GroupeBadge {...groupe} fullName className="ml-1 py-0" />
}
