import Image from 'next/image'
import { ReactNode } from 'react'
import { GrapheRepartitionGroupesLight } from '../../components/GrapheRepartitionGroupesLight'
import { B, NiceItalic } from '../../components/textHelpers'
import { TitleAndDescription } from '../../components/TitleAndDescription'
import * as types from './ComPermDoc.types'

export function Page({
  groupesDataHemicycle,
  groupesDataComFin,
  groupesDataComLois,
}: types.Props) {
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
          <B>huit groupes de travail</B> principaux, les{' '}
          <NiceItalic>commissions permanentes</NiceItalic> - on les appelle
          "permanentes" par rapport à d'autres commissions qui peuvent être
          créées ponctuellement pour un besoin précis.
        </Paragraph>
        <Image
          className="mx-auto my-2"
          src="/pics/com_aff_sociales.png"
          width={500}
          height={10000}
          alt="Photo réunion de la commission des affaires sociales"
        />
        <Paragraph>
          Ces huit commissions <B>dégrossissent les projets de loi</B> avant
          qu'ils n'arrivent devant l'ensemble des députés dans l'hémicycle.
        </Paragraph>

        <Paragraph>
          Chaque commission est spécialisée sur une thématique très large. Quand
          un projet de loi arrive à l'Assemblée, on l'assigne à la commission
          qui correspond le mieux. Il y a la{' '}
          <NiceItalic>commission des Lois</NiceItalic>, la{' '}
          <NiceItalic>commission des Finances</NiceItalic>, la{' '}
          <NiceItalic>commission des Affaires sociales</NiceItalic>, la{' '}
          <NiceItalic>
            commission des Affaires culturelles et de l'Education
          </NiceItalic>
          , la <NiceItalic>commission des Affaires économiques</NiceItalic>, la{' '}
          <NiceItalic>
            commission du Développement durable et de l'Aménagement du
            territoire
          </NiceItalic>
          , la <NiceItalic>commission des Affaires étrangères</NiceItalic>, et
          la <NiceItalic>commission de la Défense</NiceItalic>.
        </Paragraph>
        <HelperText>
          Un exemple à l'automne 2022 : le projet de loi{' '}
          <NiceItalic>
            «Mesures d’urgence relatives au fonctionnement du marché du travail
            en vue du plein emploi»
          </NiceItalic>{' '}
          est passé par la{' '}
          <NiceItalic>commission des Affaires sociales</NiceItalic>. Les députés
          qui en sont membres l'ont débattu, et légèrement modifié, lors de
          plusieurs réunions de la commission en septembre 2022.
          <Paragraph>
            Ensuite, en octobre, il a été discuté, et encore un peu modifié, par
            l'ensemble des députés au cours de plusieurs séances en hémicycle.{' '}
          </Paragraph>
        </HelperText>

        <Paragraph>
          <B>Chaque député appartient à une commission permanente</B>, et une
          seule. Généralement ils essayent d'être dans la commission qui
          correspond plus ou moins à leurs centres d'intérêts ou à leurs
          compétences.
        </Paragraph>

        <Title>Une version miniature de l'hémicycle</Title>

        <Paragraph>
          La proportion de députés de chaque groupe dans l'hémicycle est
          reproduite dans chaque commission - c'est imposé par le règlement.{' '}
          <B>On retrouve la même majorité, la même opposition</B>. Les débats y
          sont juste un peu plus calmes, et les députés présents sont un peu
          plus impliqués sur les sujets qui y sont discutés.
        </Paragraph>
        <HelperText>
          Pour illustrer, voici la répartition actuelle des groupes dans tout
          l'hémicycle ({groupesDataHemicycle.total} députés) :{' '}
          <GrapheRepartitionGroupesLight
            groupesData={groupesDataHemicycle.groupes}
          />
          On retrouve à peu près la même répartition par exemple dans la{' '}
          <NiceItalic>commission des Finances</NiceItalic> (
          {groupesDataComFin.total} députés) :
          <GrapheRepartitionGroupesLight
            groupesData={groupesDataComFin.groupes}
            forCommission
          />
          Ou dans la <NiceItalic>commission des Lois</NiceItalic> (
          {groupesDataComLois.total} députés) :
          <GrapheRepartitionGroupesLight
            groupesData={groupesDataComLois.groupes}
            forCommission
          />
          Etc.
        </HelperText>

        <Paragraph>
          Ce qui se passe en commission pour un texte de loi donné permet donc
          de deviner facilement ce qui se passera dans l’hémicycle .{' '}
          <B>Si un texte de loi est adopté par la commission</B> (avec
          éventuellement des modifications),{' '}
          <B>il sera ensuite généralement adopté par l’hémicycle</B> avec peu de
          nouvelles modifications . S’il est rejeté par la commission, on le
          présente quand même dans l’hémicycle, mais il y sera probablement
          rejeté.
        </Paragraph>
        {/* 
        <Title>Les rôles dans une commission</Title>
        <Title>Comment se déroule une réunion de commission ?</Title> */}

        <Title>Ne pas confondre</Title>
        <Paragraph>
          Quand on parle des "commissions",{' '}
          <B>on parle typiquement des commissions permanentes</B>.
        </Paragraph>

        <Paragraph>
          Pour un certain projet de loi, on parle parfois de{' '}
          <NiceItalic>la commission sur le fond</NiceItalic>, c'est la
          commission permanente principale qui travaille sur ce texte. C'est
          pour la distinguer des éventuelles{' '}
          <NiceItalic>commissions pour avis</NiceItalic>, ce sont d'autres
          commissions permanentes à qui on demande leur avis sur le texte, en
          complément.
        </Paragraph>

        <HelperText>...ajouter exemple...</HelperText>

        <Paragraph>
          Il existe aussi à l'Assemblée des{' '}
          <NiceItalic>commissions spéciales</NiceItalic>. Elles sont créées au
          cas par cas, temporairement, pour s'occuper d'un projet de loi en
          particulier. Elles remplacent la commission permanente uniquement pour
          ce texte.
        </Paragraph>
        <HelperText>
          Par exemple, en 2020 le projet de loi{' '}
          <NiceItalic>
            «Accélération et simplification de l’action publique»
          </NiceItalic>{' '}
          a été confiée à la{' '}
          <NiceItalic>
            commission spéciale chargée d'examiner le projet de loi
            d’accélération et de simplification de l’action publique
          </NiceItalic>
          .
        </HelperText>

        <Paragraph>
          Il y a aussi les <NiceItalic>commissions d’enquêtes</NiceItalic>.
          Celles-ci n'ont rien à voir avec l'élaboration de la loi. Elles sont
          créées ponctuellement pour investiguer pendant quelques mois un sujet
          de société, ou la gestion d'un service public par exemple, puis elles
          écrivent un rapport qui est présenté au reste de l'Assemblée.
        </Paragraph>
        <HelperText>
          Par exemple, en début d'année 2023, il y a eu une{' '}
          <NiceItalic>
            commission d’enquête relative aux révélations des Uber Files :
            l’ubérisation, son lobbying et ses conséquences
          </NiceItalic>
          .
        </HelperText>
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
  return <div className="mt-4">{children}</div>
}

function HelperText({ children }: { children: ReactNode }) {
  return (
    <div className="mx-6 mt-4 rounded-xl border border-slate-300 bg-yellow-100 py-2 px-6">
      {children}
    </div>
  )
}
