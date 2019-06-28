import Dexie from 'dexie'

const db = new Dexie("test")
db.version(1).stores({
  eventRow: `++id,date,amount,eventType,description`
})

export default db