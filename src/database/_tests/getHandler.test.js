import { EQUALS, DESCRIPTION, EVENT_ROW, FILTER, FILTER_GROUP, MODULE, TAG } from "../../constants";
import db from '../database'
import { getHandler } from "../getHandler";

describe('getHandler', () => {
  const eventRow = { date: Date.now(), amount: 13.24, eventType: "korttimaksu", description: "kauppa" }
  const filter = { field: DESCRIPTION, restrictionGroup: EQUALS, descriptions: ["kauppa"] }
  const filterGroup = { filterIds: [1] }
  const tag = { name: "testi" }
  const module = { name: "testi" }

  beforeAll(async () => {
    await db[EVENT_ROW].put(eventRow)
    await db[FILTER].put(filter)
    await db[FILTER_GROUP].put(filterGroup)
    await db[TAG].put(tag)
    await db[MODULE].put(module)
  })

  it('should handle eventRow', async () => {
    expect(await getHandler({ table: EVENT_ROW })).toContainEqual(eventRow)
  });

  it('should handle filter', async () => {
    expect(await getHandler({ table: FILTER })).toContainEqual(filter)
  });

  it('should handle filterGroup', async () => {
    expect(await getHandler({ table: FILTER_GROUP })).toContainEqual(filterGroup)
  });

  it('should handle tag', async () => {
    expect(await getHandler({ table: TAG })).toContainEqual(tag)
  });

  it('should handle module', async () => {
    expect(await getHandler({ table: MODULE })).toContainEqual(module)
  });

  
  it('should throw error when table is unknown', async () => {
    try {
      await getHandler({ table: "asd" })
    } catch (error) {
      expect(error.message).toEqual("tried to get from table that is undefined")
    }
  });
});