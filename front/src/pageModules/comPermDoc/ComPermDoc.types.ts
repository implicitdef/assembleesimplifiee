import { GroupData } from '../../components/GrapheRepartitionGroupesLight'

export type Props = {
  groupesDataHemicycle: Repartition
  groupesDataComFin: Repartition
}

export type Repartition = {
  total: number
  groupes: GroupData[]
}
