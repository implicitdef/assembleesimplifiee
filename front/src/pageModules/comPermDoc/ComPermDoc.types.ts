import { GroupData } from '../../components/GrapheRepartitionGroupesLIght'

export type Props = {
  groupesDataHemicycle: Repartition
  groupesDataComFin: Repartition
}

export type Repartition = {
  total: number
  groupes: GroupData[]
}
