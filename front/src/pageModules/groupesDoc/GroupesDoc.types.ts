import { ReleveTables } from '../../lib/dbReleve'

export type Props = {
  groupes: Groupe[]
}
export type Groupe = {
  group_acronym: string
  group_color: string
  group_name: string
  group_pos: ReleveTables['deputes_in_legislatures']['group_pos']
  nb_deputes: number
}
