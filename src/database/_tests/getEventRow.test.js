import { filterByDate } from "../getEventRow";
import { EQUALS, LTE, GTE } from "../../constants";

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