import Dexie from 'dexie'
import { EVENT_ROW, AMOUNT, DATE, EVENT_TYPE, DESCRIPTION } from '../constants';

const db = new Dexie("test")

db.version(1).stores({
  [EVENT_ROW]: `++id,${DATE},${AMOUNT},${EVENT_TYPE},${DESCRIPTION}`,
  test: `++id,message`
})

export default db