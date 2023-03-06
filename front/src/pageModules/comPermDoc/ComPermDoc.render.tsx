import { ReactNode } from 'react'
import { GroupeBadge } from '../../components/GroupeBadge'
import { B, NiceItalic } from '../../components/textHelpers'
import { TitleAndDescription } from '../../components/TitleAndDescription'
import * as types from './ComPermDoc.types'
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
        title="Les commissions permanentes"
        description="Explication de ce que sont les commissions permanentes à l'Assemblée Nationale, comment elles travaillent, comment elles fonctionnent"
      />

      <div className="mx-auto max-w-4xl">
        <h1 className="mt-4 text-4xl font-bold">
          C'EST QUOI LES COMMISSIONS PERMANENTES?
        </h1>
        <Paragraph>
          Pour travailler plus efficacement, les députés sont partagés en{' '}
          <B>huit groupes de travail principaux</B>, les{' '}
          <NiceItalic>commissions permanentes</NiceItalic>, qui vont dégrossir
          les projets et propositions de loi avant qu'ils n'arrivent devant
          l'ensemble des députés en hémicycle. On les appelle "permanentes" par
          rapport à d'autres commissions qui peuvent être créées ponctuellement
          pour un besoin précis.
        </Paragraph>

        <Paragraph>
          Chaque député appartient à une et une seule commission permanente.
          Généralement ils essayent d'être dans une commission qui correspond à
          leurs centres d'intérêts ou à leurs compétences.
        </Paragraph>

        <Paragraph>
          Ces commissions sont des <B>versions miniatures de l'hémicycle</B> :
          la proportion de députés de chaque groupe dans l'hémicycle est
          reproduite dans chaque commission. On retrouve la même majorité, la
          même opposition. Les débats y sont juste un peu plus calmes, et les
          députés présents sont un peu plus impliqués sur les sujets qui y sont
          discutés.
        </Paragraph>

        <Paragraph>
          Ce qui se passe en commission pour un texte de loi donné permet donc
          de deviner facilement ce qui se passera dans l’hémicycle .{' '}
          <B>Si un texte de loi est adopté par la commission</B> (avec
          éventuellement des modifications),{' '}
          <B>il sera généralement adopté par l’hémicycle</B> avec peu de
          nouvelles modifications . S’il est rejeté par la commission, on le
          présente quand même dans l’hémicycle, mais il y sera probablement
          rejeté.
        </Paragraph>
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
