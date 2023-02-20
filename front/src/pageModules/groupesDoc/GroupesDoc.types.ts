export type Props = {
  groupeRN: Groupe | null
  groupeECOLO: Groupe | null
  groupeLIOT: Groupe | null
}
export type Groupe = {
  acronym: string
  nom: string
  color: string
}
