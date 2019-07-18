import { EVENT_ROW, PUT, BULK } from './constants'
import { postMessage } from './services/workerService'

async function putEventRows(eventRows) {
  const message = new PutMessageBuilder()
    .setTable(EVENT_ROW)
    .setMode(BULK)
    .setPayload(eventRows)
    .build()
  const result = await postMessage(message)
  return result
}

export default {
  putEventRows
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