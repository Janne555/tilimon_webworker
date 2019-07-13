import Dexie from 'dexie'
import { EVENT_ROW, AMOUNT, DATE, EVENT_TYPE, DESCRIPTION, FILTER, TAG, NAME, MODULE, FILTER_GROUP } from '../constants';

const db = new Dexie("test")

db.version(1).stores({
  [EVENT_ROW]: `++id,${DATE},${AMOUNT},${EVENT_TYPE},${DESCRIPTION}`,
  [FILTER]: `++id`,
  [FILTER_GROUP]: `++id`,
  [TAG]: `++id,${NAME},${DESCRIPTION}`,
  [MODULE]: `++id`,
  log: '++id,time,timestamp,tag'
})

export default db