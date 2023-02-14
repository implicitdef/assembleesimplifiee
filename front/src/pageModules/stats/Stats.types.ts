import { ReleveTables } from '../../lib/dbReleve'
export type Params = {
  legislature?: string
}
export type Props = {
  stats: DeputeStats[]
}

export type DeputeStats = {
  depute: Depute
  statsByLegislature: [number, WeeklyStats<StatsFinal>][]
}

export type Depute = ReleveTables['deputes_in_legislatures']

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
