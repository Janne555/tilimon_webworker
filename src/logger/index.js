import db from "../database/database";

export function log(tag, message) {
  const date = new Date()
  db.log.put({ tag, message, time: date.toDateString(), timestamp: date.getTime() })
}

export function logMessage(tag, messageEvent) {
  const { queueId, method, table } = data()

  log(tag, `queueId: ${queueId}, method: ${method}, table: ${table}`)

  function data() {
    return (messageEvent && messageEvent.data) || {}
  }
}