import { EVENT_ROW, FILTER, FILTER_GROUP, TAG, MODULE } from "../constants"
import { getEventRow } from "./getEventRow"
import db from './database'

export function getHandler({ table, filterGroupId }) {
  switch (table) {
    case EVENT_ROW:
      return getEventRow(filterGroupId)
    case FILTER:
    case FILTER_GROUP:
    case TAG:
    case MODULE:
      return db[table].toCollection().toArray()
    default:
      throw Error("tried to get from table that is undefined")
  }
}