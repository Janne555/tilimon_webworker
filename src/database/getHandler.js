import { EVENT_ROW, FILTER, FILTER_GROUP, TAG, MODULE } from "../constants";
import { getEventRow } from "./getEventRow";

export function getHandler({ table, filterGroupId, ...rest }) {
  switch (table) {
    case EVENT_ROW:
      return getEventRow(filterGroupId)
    case FILTER:
      throw Error("not implemented yet")
    case FILTER_GROUP:
      throw Error("not implemented yet")
    case TAG:
      throw Error("not implemented yet")
    case MODULE:
      throw Error("not implemented yet")
    default:
      throw Error("tried to get from table that is undefined")
  }
}