import type { FonctionInCom, ReleveTables } from '../../lib/dbReleve'

export type Params = {
  legislature?: string
}
export type Props = {
  deputesWithCom: DeputeWithCom[]
  deputesWithoutCom: DeputeWithoutCom[]
  legislature: number
  legislatureNavigationUrls: [number, string][]
}

export type Depute = ReleveTables['deputes_in_legislatures']

export type DeputeWithCom = Depute & {
  com_perm_uid: string
  com_perm_name: string
  com_perm_fonction: FonctionInCom
}

export type DeputeWithoutCom = Depute & {
  com_perm_uid: null
  com_perm_name: null
  com_perm_fonction: null
}
