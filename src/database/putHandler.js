import { SINGLE, BULK, TABLES } from "../constants";
import db from "./database";

export function putHandler({ table, mode, payload }) {
  if (!TABLES.includes(table))
    throw Error("table not found")

  switch (mode) {
    case SINGLE:
      return single()
    case BULK:
      return bulk()
    default:
      throw Error("invalid mode")
  }

  async function single() {
    await db[table].put(payload)
    return await db[table].toCollection().toArray()
  }

  async function bulk() {
    await db[table].bulkPut(payload)
    return await db[table].toCollection().toArray()
  }
}
