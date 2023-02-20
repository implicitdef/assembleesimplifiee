import { ReactNode } from 'react'
import { GroupeBadge } from '../../components/GroupeBadge'
import { NiceItalic } from '../../components/NiceItalic'
import { TitleAndDescription } from '../../components/TitleAndDescription'
import * as types from './GroupesDoc.types'
import sortBy from 'lodash/sortBy'

export function Page({ groupes }: types.Props) {
  const groupeRN = groupes.find(_ => _.group_acronym === 'RN')
  const groupeECOLO = groupes.find(_ => _.group_acronym === 'ECOLO')
  const groupeLIOT = groupes.find(_ => _.group_acronym === 'LIOT')

  const groupeMajoritaire = groupes.find(_ => _.group_pos === 'maj')
  const groupesMinoritaires = sortGroupes(
    groupes.filter(_ => _.group_pos === 'min'),
  )
  const groupesOpposition = sortGroupes(
    groupes.filter(_ => _.group_pos === 'opp'),
  )

  return (
    <div className="mb-10">
      <TitleAndDescription
        title="Les groupes"
        description="Explication de ce que sont les groupes parlementaires à l'Assemblée Nationale, comment ils regroupent les députés, comment ils fonctionnent"
      />

      <div className="mx-auto max-w-4xl">
        <h1 className="mt-4 text-4xl font-bold">C'EST QUOI LES GROUPES ?</h1>
        <Paragraph>
          Les députés s'organisent par groupes de 15 députés ou plus, suivant
          leurs affinités politiques. On appelle cela les{' '}
          <NiceItalic>groupes parlementaires</NiceItalic>. Ce sont un peu comme
          des partis, mais internes à l'Assemblée.
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
          <NiceItalic>non-inscrits</NiceItalic>.
        </Paragraph>
        <Paragraph>
          <span className="font-bold">
            Dans un même groupe, les députés votent généralement de la même
            manière
          </span>
          . Ils n'y sont pas obligés, mais risquent de se faire exclure du
          groupe par leur collègues s'ils désobéissent.
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
        <Title>La majorité et l'opposition</Title>
        <Paragraph>
          Lorsque des députés forment un groupe, ils peuvent choisir d'être un{' '}
          <NiceItalic>«groupe d'opposition»</NiceItalic> (c'est-à-dire, opposé à
          la politique du gouvernement).{' '}
          <span className="font-bold">C'est purement déclaratif</span>, cela
          n'engage à rien et peut être changé à tout moment. Un groupe
          d'opposition a quelques droits supplémentaires : les journées de
          "niche parlementaire" et la présidence de la commission des finances
          notamment.
        </Paragraph>

        <Paragraph>
          Parmi les autres groupes, le plus grand d'entre eux est
          automatiquement appelé <NiceItalic>«groupe majoritaire»</NiceItalic>,
          et les autres sont dit <NiceItalic>«minoritaires»</NiceItalic>. Dans
          la pratique, les groupes minoritaires sont alliés du groupe
          majoritaire et votent exactement comme lui. On dit souvent{' '}
          <span className="font-bold">"la majorité" </span> pour désigner à la
          fois le groupe majoritaire et les groupes minoritaires.
        </Paragraph>

        <Paragraph>
          Les groupes minoritaires ont également accès aux journées de niche
          parlementaire, mais pas aux autres avantages de l'opposition. Quant au
          groupe majoritaire, il n'a aucun droit particulier.
        </Paragraph>

        {groupeMajoritaire && (
          <HelperText>
            <p className="mb-1">
              Dans la configuration actuelle
              <QuickBadge groupe={groupeMajoritaire} /> est le groupe
              majoritaire.
            </p>
            <div className="mb-1">
              Les groupes minoritaires sont :
              <ul className="pl-4">
                {groupesMinoritaires.map(g => (
                  <li key={g.group_acronym}>
                    <QuickBadge groupe={g} />
                  </li>
                ))}
              </ul>
            </div>
            <div className="mb-1">
              Les groupes d'opposition sont :
              <ul className="pl-4">
                {groupesOpposition.map(g => (
                  <li key={g.group_acronym}>
                    <QuickBadge groupe={g} />
                  </li>
                ))}
              </ul>
            </div>
          </HelperText>
        )}

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
          un groupe. Par exemple un groupe ne peut pas avoir 14 membres à part
          entière et 3 membres apparentés - il doit absorber un des membres
          apparentés, ou disparaitre.
        </Paragraph>
        <Title>Ne pas confondre</Title>
        <Paragraph>
          Quand on parle de "groupes", on parle typiquement des groupes
          parlementaires. Il existe aussi à l'Assemblée des{' '}
          <NiceItalic>groupes d'études</NiceItalic>, des{' '}
          <NiceItalic>groupes d'amitié</NiceItalic>, et des{' '}
          <NiceItalic>groupes de travail</NiceItalic>, qui n'ont rien à avoir
          avec les premiers.
        </Paragraph>
      </div>
    </div>
  )
}

function Title({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <h2
      className={`mt-6 border-b-4 border-dotted border-slate-500 pb-2 text-left text-3xl font-bold ${
        className ?? ''
      }`}
    >
      {children}
    </h2>
  )
}

function Paragraph({ children }: { children: ReactNode }) {
  return <p className="mt-4">{children}</p>
}

function HelperText({ children }: { children: ReactNode }) {
  return (
    <div className="mx-6 mt-4 rounded-xl border border-slate-300 bg-yellow-100 py-2 px-6">
      {children}
    </div>
  )
}

function QuickBadge({ groupe }: { groupe: types.Groupe }) {
  const { group_acronym, group_color, group_name } = groupe

  return (
    <GroupeBadge
      acronym={group_acronym}
      color={group_color}
      nom={group_name}
      fullName
      className="ml-1 py-0"
    />
  )
}

function sortGroupes(groupes: types.Groupe[]) {
  return sortBy(groupes, _ => -_.nb_deputes)
}
