import db from '../database'
import { TABLES, EVENT_ROW, FILTER, ANY_OF, FILTER_GROUP } from '../../constants';
import { getHandler } from '../getHandler';

describe('getHandler', () => {
  let filterGroupId
  const eventRow = { date: Date.now(), amount: 13.24, eventType: "korttimaksu", description: "kauppa" }
  beforeEach(async () => {
    await db[EVENT_ROW].bulkPut([eventRow])
    const filterId = await db[FILTER].put({ restrictionGroup: ANY_OF, descriptions: ["kauppa"] })
    filterGroupId = await db[FILTER_GROUP].put({ filterIds: [filterId] })

  })

  afterEach(async () => {
    await Promise.all(TABLES.map(table => db[table].clear()))
  })

  it('should handle get request', async () => {
    expect(await getHandler({ table: EVENT_ROW, filterGroupId })).toContainEqual({...eventRow, id: 1})
  });
});