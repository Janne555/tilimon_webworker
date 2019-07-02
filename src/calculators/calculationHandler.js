import { getHandler } from "../database/getHandler";
import { EVENT_ROW, DAY, WEEK, YEAR, SUM, AVERAGE, TOTAL_SUM, TOTAL_AVERAGE, MONTH } from "../constants";
import getISOWeek from 'date-fns/get_iso_week'
import getISOYear from 'date-fns/get_iso_year'
import getDate from 'date-fns/get_date'
import getMonth from 'date-fns/get_month'

export async function calculationHandler({ filterGroupId, grouping, calculation }) {
  switch (calculation) {
    case SUM:
      return groupedSum(groupEventRows(grouping, await getHandler(EVENT_ROW, filterGroupId)))
    case AVERAGE:
      return groupedAverage(groupEventRows(grouping, await getHandler(EVENT_ROW, filterGroupId)))
    case TOTAL_SUM:
      return totalSum(groupEventRows(grouping, await getHandler(EVENT_ROW, filterGroupId)))
    case TOTAL_AVERAGE:
      return totalAverage(groupEventRows(grouping, await getHandler(EVENT_ROW, filterGroupId)))
    default:
      throw Error("unknown calculation")
  }
}

export function sum(eventRows, getAmount) {
  return eventRows.reduce((sum, curr) => sum + getAmount(curr), 0)
}

export function average(eventRows, getAmount) {
  return eventRows.reduce((acc, curr, index, array) => {
    if (index === array.length - 1)
      return (acc + getAmount(curr)) / array.length
    return acc + getAmount(curr)
  }, 0)
}

export function groupedSum(groupedEventRows) {
  return groupedEventRows.map(group => sum(group, eventRow => eventRow.amount))
}

export function groupedAverage(groupedEventRows) {
  return groupedEventRows.map(group => average(group, eventRow => eventRow.amount))
}

export function totalSum(groupedEventRows) {
  return sum(groupedSum(groupedEventRows), amount => amount)
}

export function totalAverage(groupedEventRows) {
  return average(groupedSum(groupedEventRows), amount => amount)
}

export function groupEventRows(grouping, eventRows) {
  switch (grouping) {
    case DAY:
      return partitionEventRows(dayGroupKey)
    case WEEK:
      return partitionEventRows(weekGroupKey)
    case MONTH:
      return partitionEventRows(monthGroupKey)
    case YEAR:
      return partitionEventRows(yearGroupKey)
    case undefined:
      return [eventRows]
    default:
      throw Error("unknown grouping")
  }

  function partitionEventRows(generateGroupKey) {
    let groupedEventRows = {}
    eventRows.forEach(eventRow => pushToGroup(eventRow, generateGroupKey(new Date(eventRow.date))))

    return Object.values(groupedEventRows)

    function pushToGroup(eventRow, groupKey) {
      if (!(groupKey in groupedEventRows))
        groupedEventRows[groupKey] = []
      groupedEventRows[groupKey].push(eventRow)
    }
  }
}

export function dayGroupKey(date) {
  return `${getDate(date)}${getMonth(date)}${getISOYear(date)}`
}

export function weekGroupKey(date) {
  return `${getISOWeek(date)}${getISOYear(date)}`
}

export function monthGroupKey(date) {
  return `${getMonth(date)}${getISOYear(date)}`
}

export function yearGroupKey(date) {
  return `${getISOYear(date)}`
}