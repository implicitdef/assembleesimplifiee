import { ReleveTables } from '../../lib/dbReleve'
export type Params = {
  legislature?: string
}
export type Props = {
  deputes: Depute[]
  legislature: number
  legislatureNavigationUrls: [number, string][]
}

export type Depute = ReleveTables['deputes_in_legislatures']
