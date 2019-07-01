import { filterByDate, filterByDescription, filterByAmount } from "../getEventRow";
import { EQUALS, LTE, GTE, ANY_OF, NONE_OF } from "../../constants";

describe('getEventRow', () => {
  it('should ', () => {

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
});

describe('filterByAmount', () => {
  it('should return true when comparing equality among equal amounts', () => {
    expect(filterByAmount({ amount: 10.12 }, { comparisonOperator: EQUALS, amount: 10.12 })).toBe(true)
  });

  it('should return false when comparing equality among uneqaual amounts', () => {
    expect(filterByAmount({ amount: 10.12 }, { comparisonOperator: EQUALS, amount: 10.11 })).toBe(false)
  });

  it('should return false when comparing to a lower amount and comparison operator is LTE', () => {
    expect(filterByAmount({ amount: 10.12 }, { comparisonOperator: LTE, amount: 10.11 })).toBe(false)
  });

  it('should return true when comparing to a greater amount and comparison operator is LTE', () => {
    expect(filterByAmount({ amount: 10.12 }, { comparisonOperator: LTE, amount: 10.14 })).toBe(true)
  });

  it('should return true when comparing to an equal amount and comparison operator is LTE', () => {
    expect(filterByAmount({ amount: 10.12 }, { comparisonOperator: LTE, amount: 10.12 })).toBe(true)
  });

  it('should return true when comparing to a lower amount and comparison operator is GTE', () => {
    expect(filterByAmount({ amount: 10.12 }, { comparisonOperator: GTE, amount: 10.11 })).toBe(true)
  });

  it('should return false when comparing to an greater amount and comparison operator is GTE', () => {
    expect(filterByAmount({ amount: 10.12 }, { comparisonOperator: GTE, amount: 10.13 })).toBe(false)
  });

  it('should return true when comparing to an equal amount and comparison operator is GTE', () => {
    expect(filterByAmount({ amount: 10.12 }, { comparisonOperator: GTE, amount: 10.12 })).toBe(true)
  });
});