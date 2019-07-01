import db from './database'
import { EVENT_ROW, FILTER, FILTER_GROUP, DATE, AMOUNT, DESCRIPTION, EQUALS, ANY_OF, NONE_OF, GTE, LTE } from "../constants";

export async function getEventRow(filterGroupId) {
  let eventRowCollection = db[EVENT_ROW].toCollection()
  const filters = await getFilters()
  filters.forEach(filter => {
    eventRowCollection.filter(runFilter(filter))
  })

  return await eventRowCollection.toArray()

  async function getFilters() {
    if (!filterGroupId)
      return []

    const filterGroup = await db[FILTER_GROUP].get(filterGroupId)
    if (!filterGroup)
      throw Error(`no filter group found by id: ${filterGroupId}`)
    const temp = await db[FILTER].where("id").anyOf(filterGroup.filterIds).toArray()
    return temp
  }
}

export function runFilter(filter) {
  return function (eventRow) {
    switch (filter.field) {
      case DATE:
        return filterByDate(eventRow, filter)
      case AMOUNT:
        return filterByAmount(eventRow, filter)
      case DESCRIPTION:
        return filterByDescription(eventRow, filter)
      default:
        throw Error("unknown field for filter")
    }
  }
}

export const filterByAmount = (eventRow, { comparisonOperator, amount }) => {
  switch (comparisonOperator) {
    case EQUALS:
      return eventRow.amount === amount
    case GTE:
      return eventRow.amount >= amount
    case LTE:
      return eventRow.amount <= amount
    default:
      throw new Error("invalid comparison operator")
  }
}

export const filterByDescription = (eventRow, { restrictionGroup, descriptions }) => {
  const hits = descriptions.filter(description => eventRow.description === description)
  switch (restrictionGroup) {
    case EQUALS:
      return hits.length === descriptions.length
    case ANY_OF:
      return hits.length >= 1
    case NONE_OF:
      return hits.length === 0
    default:
      throw Error("invalid restriction group")
  }
}

export const filterByDate = (eventRow, { comparisonOperator, date }) => {
  switch (comparisonOperator) {
    case EQUALS:
      return eventRow.date === date
    case GTE:
      return eventRow.date >= date
    case LTE:
      return eventRow.date <= date
    default:
      throw new Error("invalid comparison operator")
  }
}
