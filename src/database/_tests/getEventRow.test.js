import { filterByDate, filterByDescription, filterByAmount, runFilter, getEventRow } from "../getEventRow";
import { EQUALS, LTE, GTE, ANY_OF, NONE_OF, DATE, AMOUNT, DESCRIPTION, EVENT_ROW, FILTER, FILTER_GROUP, TAG } from "../../constants";
import db from '../database'

describe('getEventRow', () => {
  let filterGroupId
  const eventRow = { date: Date.now(), amount: 13.24, eventType: "korttimaksu", description: "kauppa" }
  const eventRow2 = { date: Date.now(), amount: 13.24, eventType: "korttimaksu", description: "ruokala" }

  beforeAll(async () => {
    await db[EVENT_ROW].bulkPut([eventRow, eventRow2])
    const filterId = await db[FILTER].put({ field: DESCRIPTION, restrictionGroup: EQUALS, descriptions: ["kauppa"] })
    filterGroupId = await db[FILTER_GROUP].put({ filterIds: [filterId] })
    await db[TAG].put({ name: "turhat", description: "ruokala" })
  })

  it('should handle get eventRow', async () => {
    expect(await getEventRow(filterGroupId)).toEqual([{ ...eventRow, id: 1 }])
  });

  it('should get all if no filterGroupId', async () => {
    expect(await getEventRow()).toEqual([{ ...eventRow, id: 1 }, { ...eventRow2, id: 2 }])
  });

  it('should throw if filtergroupid is invalid', async () => {
    try {
      await getEventRow("asd")
    } catch (error) {
      expect(error.message).toEqual("no filter group found by id: asd")
    }
  });

  it('should add tags if option is true', async () => {
    expect(await getEventRow(undefined, true)).toEqual([{ ...eventRow, id: 1, tags: [] }, { ...eventRow2, id: 2, tags: [{ description: "ruokala", id: 1, name: "turhat" }] }])
  });
});

describe('runFilter', () => {
  const eventRow = { description: "kauppa", amount: 13.23, date: Date.now() }

  it('should handle date', () => {
    expect(runFilter({ field: DATE, comparisonOperator: GTE })(eventRow)).toBe(false)
  });

  it('should handle amount', () => {
    expect(runFilter({ field: AMOUNT, comparisonOperator: GTE })(eventRow)).toBe(false)
  });

  it('should handle description', () => {
    expect(runFilter({ field: DESCRIPTION, restrictionGroup: ANY_OF, descriptions: [] })(eventRow)).toBe(false)
  });

  it('should throw on unknown field', () => {
    expect(() => runFilter({ field: "asd" })(eventRow)).toThrowError("unknown field for filter")
  });
});

describe('filterByDate', () => {
  const dateA = Date.UTC(2010, 1, 1)
  const dateB = Date.UTC(2010, 1, 2)
  const dateC = Date.UTC(2010, 2, 1)

  it('should return true when comparing equality among equal timestamps', () => {
    expect(filterByDate({ date: dateA }, { comparisonOperator: EQUALS, date: dateA })).toBe(true)
  });

  it('should return false when comparing equality among uneqaual timestamps', () => {
    expect(filterByDate({ date: dateA }, { comparisonOperator: EQUALS, date: dateC })).toBe(false)
  });

  it('should return false when comparing to a later date and comparison operator is LTE', () => {
    expect(filterByDate({ date: dateB }, { comparisonOperator: LTE, date: dateA })).toBe(false)
  });

  it('should return true when comparing to an earlier date and comparison operator is LTE', () => {
    expect(filterByDate({ date: dateB }, { comparisonOperator: LTE, date: dateC })).toBe(true)
  });

  it('should return true when comparing to an equal date and comparison operator is LTE', () => {
    expect(filterByDate({ date: dateB }, { comparisonOperator: LTE, date: dateB })).toBe(true)
  });

  it('should return true when comparing to a later date and comparison operator is GTE', () => {
    expect(filterByDate({ date: dateB }, { comparisonOperator: GTE, date: dateA })).toBe(true)
  });

  it('should return false when comparing to an earlier date and comparison operator is GTE', () => {
    expect(filterByDate({ date: dateB }, { comparisonOperator: GTE, date: dateC })).toBe(false)
  });

  it('should return true when comparing to an equal date and comparison operator is GTE', () => {
    expect(filterByDate({ date: dateB }, { comparisonOperator: GTE, date: dateB })).toBe(true)
  });

  it('should throw error if comparison operator is unknown', () => {
    expect(() => filterByDate({ date: dateB }, { comparisonOperator: "asd", date: dateB })).toThrowError("invalid comparison operator")
  });
});

describe('filterByDescription', () => {
  const eventRow = { description: "kauppa" }

  it('should return true when descriptions equal and restrictionGroup is equals', () => {
    expect(filterByDescription(eventRow, { restrictionGroup: EQUALS, descriptions: ["kauppa"] })).toBe(true)
    expect(filterByDescription(eventRow, { restrictionGroup: EQUALS, descriptions: ["kauppa", "kauppa"] })).toBe(true)
  });

  it('should return false when descriptions are unequal and restrictionGroup is equals', () => {
    expect(filterByDescription(eventRow, { restrictionGroup: EQUALS, descriptions: ["matka"] })).toBe(false)
    expect(filterByDescription(eventRow, { restrictionGroup: EQUALS, descriptions: ["kauppa", "matka"] })).toBe(false)
  });

  it('should return true when descriptions have atleast one equal and restrictionGroup is any of', () => {
    expect(filterByDescription(eventRow, { restrictionGroup: ANY_OF, descriptions: ["kauppa"] })).toBe(true)
    expect(filterByDescription(eventRow, { restrictionGroup: ANY_OF, descriptions: ["kauppa", "matka"] })).toBe(true)
  });

  it('should return false when descriptions have no equals and restrictionGroup is any of', () => {
    expect(filterByDescription(eventRow, { restrictionGroup: ANY_OF, descriptions: ["matka"] })).toBe(false)
    expect(filterByDescription(eventRow, { restrictionGroup: ANY_OF, descriptions: ["ruokala", "matka"] })).toBe(false)
  });

  it('should return true when descriptions have no equals and restrictionGroup is none of', () => {
    expect(filterByDescription(eventRow, { restrictionGroup: NONE_OF, descriptions: ["matka"] })).toBe(true)
    expect(filterByDescription(eventRow, { restrictionGroup: NONE_OF, descriptions: ["ruokala", "matka"] })).toBe(true)
  });

  it('should return false when descriptions have some equal and restrictionGroup is none of', () => {
    expect(filterByDescription(eventRow, { restrictionGroup: NONE_OF, descriptions: ["kauppa"] })).toBe(false)
    expect(filterByDescription(eventRow, { restrictionGroup: NONE_OF, descriptions: ["ruokala", "kauppa"] })).toBe(false)
  });

  it('should throw error if restriction group is unknown', () => {
    expect(() => filterByDescription(eventRow, { restrictionGroup: "asd", descriptions: ["ruokala", "kauppa"] })).toThrowError("invalid restriction group")
  });
});

describe('filterByAmount', () => {
  it('should return true when comparing equality among equal amounts', () => {
    expect(filterByAmount({ amount: 10.12 }, { comparisonOperator: EQUALS, value: 10.12 })).toBe(true)
  });

  it('should return false when comparing equality among uneqaual amounts', () => {
    expect(filterByAmount({ amount: 10.12 }, { comparisonOperator: EQUALS, value: 10.11 })).toBe(false)
  });

  it('should return false when comparing to a lower amount and comparison operator is LTE', () => {
    expect(filterByAmount({ amount: 10.12 }, { comparisonOperator: LTE, value: 10.11 })).toBe(false)
  });

  it('should return true when comparing to a greater amount and comparison operator is LTE', () => {
    expect(filterByAmount({ amount: 10.12 }, { comparisonOperator: LTE, value: 10.14 })).toBe(true)
  });

  it('should return true when comparing to an equal amount and comparison operator is LTE', () => {
    expect(filterByAmount({ amount: 10.12 }, { comparisonOperator: LTE, value: 10.12 })).toBe(true)
  });

  it('should return true when comparing to a lower amount and comparison operator is GTE', () => {
    expect(filterByAmount({ amount: 10.12 }, { comparisonOperator: GTE, value: 10.11 })).toBe(true)
  });

  it('should return false when comparing to an greater amount and comparison operator is GTE', () => {
    expect(filterByAmount({ amount: 10.12 }, { comparisonOperator: GTE, value: 10.13 })).toBe(false)
  });

  it('should return true when comparing to an equal amount and comparison operator is GTE', () => {
    expect(filterByAmount({ amount: 10.12 }, { comparisonOperator: GTE, value: 10.12 })).toBe(true)
  });

  it('should throw error if restriction group is unknown', () => {
    expect(() => filterByAmount({ amount: 10.12 }, { comparisonOperator: "asd", value: 10.12 })).toThrowError("invalid comparison operator")
  });
});