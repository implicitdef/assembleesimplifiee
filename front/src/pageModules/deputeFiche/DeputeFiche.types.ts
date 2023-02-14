import type { ReleveTables } from '../../lib/dbReleve'
export type Params = {
  slug: string
  legislature?: string
}

export type Props = {
  deputeData: DeputeData
}
export type Depute = ReleveTables['deputes_in_legislatures']

export type DeputeData = {
  nosDeputesUrl: string | null
  dataInLegislatures: [number, DeputeDataForLegislature][]
}

export type DeputeDataForLegislature = {
  depute: Depute
  mandats: Mandat[]
  stats: WeeklyStats<StatsFinal> | null
  legislatureDates: {
    date_debut: string
    date_fin: string | null
  }
}

export type Mandat = {
  legislature: number
  mandat_uid: string
  date_debut: string
  date_fin: string | null
}

export type WeeklyStats<A> = { [weekMonday: string]: A }

export type StatsRawFromDb = {
  isVacances: boolean
  nb_presences_hemicycle: number
  nb_presences_commission: number
  nb_participations_hemicycle: number
  nb_participations_commission: number
  mediane_presences_hemicycle: number
  mediane_presences_commission: number
  mediane_presences_total: number
}

export type StatsFinal = {
  isVacances: boolean
  presences: number
  mediane_presences: number
}
