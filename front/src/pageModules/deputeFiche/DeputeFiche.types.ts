import { WithLatestGroupOrNull } from '../../lib/addLatestGroup'

export type Params = {
  slug: string
  legislature?: string
}

export type Props = {
  depute: Depute
  legislatureDates: {
    date_debut: string
    date_fin: string | null
  }
  legislature: number
  legislatureNavigationUrls: [number, string][]
}

export type Depute = WithLatestGroupOrNull<{
  uid: string
  gender: 'H' | 'F'
  slug: string
  full_name: string
  circo_departement: string
  circo_number: number
  date_of_birth: string
  mandats_this_legislature: Mandat[]
  legislatures: number[]
  stats: WeeklyStats<StatsFinal> | null
}>

export type Mandat = {
  uid: string
  cause_mandat: string
  cause_fin: string | null
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
