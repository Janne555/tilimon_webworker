import db from './database'
import { EVENT_ROW, FILTER, FILTER_GROUP, DATE, AMOUNT, DESCRIPTION, EQUALS, ANY_OF, NONE_OF, GTE, LTE, TAG } from "../constants";

export async function getEventRow(filterGroupId, withTags) {
  let eventRows = await db[EVENT_ROW].toArray()
  const filters = await getFilters()

  filters.forEach(filter => {
    eventRows = eventRows.filter(runFilter(filter))
  })

  if (withTags) {
    let tags = await db[TAG].toCollection().toArray()
    return eventRows.map(eventRow => ({ ...eventRow, tags: tags.filter(tag => tag.description === eventRow.description) }))
  }

  return eventRows

  async function getFilters() {
    if (!filterGroupId)
      return []

    const filterGroup = await db[FILTER_GROUP].get(filterGroupId)
    console.log(filterGroupId, filterGroup)
    if (!filterGroup)
      throw Error(`no filter group found by id: ${filterGroupId}`)
    return await db[FILTER].where("id").anyOf(filterGroup.filterIds).toArray()
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

export const filterByAmount = (eventRow, { comparisonOperator, value }) => {
  switch (comparisonOperator) {
    case EQUALS:
      return eventRow.amount === value
    case GTE:
      return eventRow.amount >= value
    case LTE:
      return eventRow.amount <= value
    default:
      throw new Error(`invalid comparison operator: ${comparisonOperator}`)
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
