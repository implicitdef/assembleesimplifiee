import groupBy from 'lodash/groupBy'
import mapValues from 'lodash/mapValues'
import sum from 'lodash/sum'
import sortBy from 'lodash/sortBy'
import { GetStaticProps } from 'next'
import { dbReleve } from '../../lib/dbReleve'
import * as types from './deputesAbsents.types'

const MINIMUM_ABSENT_WEEKS = 8
const COVID_WEEKS = [
  '2020-03-16',
  '2020-03-23',
  '2020-03-30',
  '2020-04-06',
  '2020-04-13',
  '2020-04-20',
  '2020-04-27',
  '2020-05-04',
  '2020-05-11',
  '2020-05-18',
  '2020-05-25',
  '2020-06-01',
]

export const getStaticProps: GetStaticProps<
  types.Props,
  types.Params
> = async context => {
  const allStats = await queryAllStats()

  const filteredStats = allStats
    .map(({ stats, uid, legislature }) => {
      let wasAbsentLastWeek = false
      let successiveWeeksAbsent: number[] = []
      sortBy(Object.entries(stats), _ => _[0]).forEach(
        ([week, statsThisWeek]) => {
          const absent =
            statsThisWeek.presences === 0 &&
            !statsThisWeek.isVacances &&
            statsThisWeek.mediane_presences > 0 &&
            !COVID_WEEKS.includes(week)
          if (absent) {
            if (wasAbsentLastWeek) {
              // increment the last
              const last =
                successiveWeeksAbsent[successiveWeeksAbsent.length - 1]
              successiveWeeksAbsent[successiveWeeksAbsent.length - 1] = last + 1
            } else {
              // start a new count
              successiveWeeksAbsent.push(1)
            }
            wasAbsentLastWeek = true
          } else {
            wasAbsentLastWeek = false
          }
        },
      )
      const wasAbsentEnough = successiveWeeksAbsent.some(
        _ => _ >= MINIMUM_ABSENT_WEEKS,
      )
      const totalWeeksAbsent = sum(successiveWeeksAbsent)
      return {
        stats,
        uid,
        legislature,
        wasAbsentEnough,
        totalWeeksAbsent,
      }
    })
    .filter(_ => _.wasAbsentEnough)

  const uids = filteredStats.map(_ => _.uid)

  const deputes: types.Depute[] = uids.length
    ? await dbReleve
        .selectFrom('deputes_in_legislatures')
        .distinctOn('uid')
        .orderBy('uid')
        .orderBy('legislature', 'desc')
        .where('uid', 'in', uids)
        .selectAll()
        .execute()
    : []

  const stats = sortBy(
    Object.values(groupBy(filteredStats, _ => _.uid)).map(statsDepute => {
      const uid = statsDepute[0].uid
      const depute = deputes.find(_ => _.uid === uid)
      if (!depute) {
        throw new Error(`Can't find depute for stats with uid ${uid}`)
      }
      const statsByLegislature: [
        number,
        types.WeeklyStats<types.StatsFinal>,
      ][] = sortBy(
        statsDepute.map(statsEachLegislature => {
          return [statsEachLegislature.legislature, statsEachLegislature.stats]
        }),
        _ => -_[0],
      )
      const totalWeeksAbsent = sum(statsDepute.map(_ => _.totalWeeksAbsent))
      return {
        depute,
        statsByLegislature,
        totalWeeksAbsent,
      }
    }),
    _ => -_.totalWeeksAbsent,
  )

  return {
    props: {
      stats,
    },
  }
}

async function queryAllStats(): Promise<
  {
    uid: string
    legislature: number
    stats: types.WeeklyStats<types.StatsFinal>
  }[]
> {
  const rows = await dbReleve
    .selectFrom('nosdeputes_deputes_weekly_stats')
    .selectAll()
    .execute()

  return rows.map(row => {
    const legislature = row.legislature
    const uid = row.uid
    const statsRaw = row.data as types.WeeklyStats<types.StatsRawFromDb>

    const statsFinal = mapValues(statsRaw, raw => ({
      isVacances: raw.isVacances,
      presences: raw.nb_presences_commission + raw.nb_presences_hemicycle,
      mediane_presences: raw.mediane_presences_total,
    }))
    return {
      legislature,
      uid,
      stats: statsFinal,
    }
  })
}
