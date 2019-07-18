import { EVENT_ROW, PUT, BULK } from './constants'
import { postMessage } from './services/workerService'

export async function putEventRows(evenRows) {
  const message = new PutMessageBuilder()
    .setTable(EVENT_ROW)
    .setMode(BULK)
    .setPayload(evenRows)
    .build()
  const result = await postMessage(message)
  return result
}

class PutMessageBuilder {
  setTable = (table) => {
    this.table = table
    return this
  }

  setMode = (mode) => {
    this.mode = mode
    return this
  }

  setPayload = (payload) => {
    this.payload = payload
    return this
  }

  build = () => {
    return { table: this.table, method: PUT, mode: this.mode, payload: this.payload }
  }
}