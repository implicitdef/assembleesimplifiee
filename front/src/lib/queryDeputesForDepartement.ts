import type { ReleveTables } from './dbReleve'
import { dbReleve } from './dbReleve'
import { LATEST_LEGISLATURE } from './hardcodedData'

export type DeputeInDepartement = ReleveTables['deputes_in_legislatures']

export async function queryDeputesForDepartement(
  nomDepartement: string,
): Promise<DeputeInDepartement[]> {
  return await dbReleve
    .selectFrom('deputes_in_legislatures')
    .where('legislature', '=', LATEST_LEGISLATURE)
    .where('ongoing', '=', true)
    .where('circo_dpt_name', '=', nomDepartement)
    .selectAll()
    .execute()
}
