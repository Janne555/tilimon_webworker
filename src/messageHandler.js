import { PUT, GET, DELETE, SINGLE, BULK, TABLES } from "./constants";
import db from "./database/database";

export function messageHandler({data}) {
  switch (data.method) {
    case PUT:
      return putHandler(data)
    case GET:
      throw Error("not implemented yet")
    case DELETE:
      throw Error("not implemented yet")
    default:
      throw Error("method not recognized")
  }
}

export function putHandler({ table, mode, payload }) {
  if (!TABLES.includes(table))
    throw Error("table not found")
  
  switch (mode) {
    case SINGLE:
      return single()
    case BULK:
      throw Error("not implemented")
    default:
      throw Error("invalid mode")
  }

  async function single() {
    await db[table].put(payload)
    return await db[table].toCollection().toArray()
  }
}