import { dayGroupKey, weekGroupKey, monthGroupKey, yearGroupKey, groupEventRows, calculationHandler } from "../calculationHandler";
import { DAY, WEEK, MONTH, YEAR, SUM, AVERAGE, TOTAL_SUM, TOTAL_AVERAGE, EVENT_ROW } from "../../constants";
import db from "../../database/database";
const getHandler = require('../../database/getHandler')
function eventRows() {
  return [
    {
      date: 1549144800000, // 2019-02-02
      amount: 607
    },
    {
      date: 1549231200000, // 2019-02-03
      amount: -8.23
    },
    {
      date: 1549317600000, // 2019-02-04
      amount: -2.6
    },
    {
      date: 1549317600000, // 2019-02-04
      amount: -4.75
    },
    {
      date: 1549404000000, // 2019-02-05
      amount: -15
    },
    {
      date: 1549404000000, // 2019-02-05
      amount: -2.6
    },
    {
      date: 1551744000000, // 2019-03-05
      amount: -9
    }
  ]
}

describe('calculationHandler', () => {

  it('should integrate', async () => {
    await db[EVENT_ROW].bulkPut(
      [
        { date: Date.now(), amount: 13.24, eventType: "korttimaksu", description: "kauppa" },
        { date: Date.now(), amount: 13.24, eventType: "korttimaksu", description: "ruokala" }
      ])

    return calculationHandler({ grouping: DAY, calculation: SUM })
      .then(result => {
        expect(result).toEqual([26.48])
      })
  })

  it('should calculate grouped sum', () => {
    jest.spyOn(getHandler, 'getHandler').mockImplementation(() => Promise.resolve(eventRows()))
    return calculationHandler({ grouping: DAY, calculation: SUM })
      .then(result => {
        expect(result).toEqual([607, -8.23, -7.35, -9, -17.6])
      })
  });

  it('should calculate grouped average', () => {
    jest.spyOn(getHandler, 'getHandler').mockImplementation(() => Promise.resolve(eventRows()))
    return calculationHandler({ grouping: DAY, calculation: AVERAGE })
      .then(result => {
        expect(result).toEqual([607, -8.23, -3.675, -9, -8.8])
      })
  });

  it('should calculate total sum', () => {
    jest.spyOn(getHandler, 'getHandler').mockImplementation(() => Promise.resolve(eventRows()))
    return calculationHandler({ grouping: DAY, calculation: TOTAL_SUM })
      .then(result => {
        expect(result).toBeCloseTo(564.8199)
      })
  });

  it('should calculate total average', () => {
    jest.spyOn(getHandler, 'getHandler').mockImplementation(() => Promise.resolve(eventRows()))

    return calculationHandler({ grouping: DAY, calculation: TOTAL_AVERAGE })
      .then(result => {
        expect(result).toBeCloseTo(112.9639)
      })
  });

  it('should throw on unknown calculation', () => {
    jest.spyOn(getHandler, 'getHandler').mockImplementation(() => Promise.resolve(eventRows()))
    return calculationHandler({ grouping: DAY, calculation: "asd" })
      .catch(error => {
        expect(error.message).toEqual("unknown calculation")
      })
  });

  it('should throw on unknown calculation', () => {
    jest.spyOn(getHandler, 'getHandler').mockImplementation(() => Promise.resolve(eventRows()))
    return calculationHandler({ grouping: "ASd", calculation: SUM })
      .catch(error => {
        expect(error.message).toEqual("unknown grouping")
      })
  });
});

describe('groupEventRows', () => {
  it('should group by day', () => {
    expect(groupEventRows(DAY, eventRows()).length).toEqual(5)
  });

  it('should group by week', () => {
    expect(groupEventRows(WEEK, eventRows()).length).toEqual(3)
  });

  it('should group by month', () => {
    expect(groupEventRows(MONTH, eventRows()).length).toEqual(2)
  });

  it('should group by year', () => {
    expect(groupEventRows(YEAR, eventRows()).length).toEqual(1)
  });

  it('should group by undefined', () => {
    expect(groupEventRows(undefined, eventRows()).length).toEqual(1)
  });
});

describe('keyGenerators', () => {
  it('should generate key for days', () => {
    expect(dayGroupKey(new Date("2110-10-10"))).toEqual("1092110")
  });

  it('should generate key for weeks', () => {
    expect(weekGroupKey(new Date("2110-10-10"))).toEqual("412110")
  });

  it('should generate key for months', () => {
    expect(monthGroupKey(new Date("2110-10-10"))).toEqual("92110")
  });

  it('should generate key for years', () => {
    expect(yearGroupKey(new Date("2110-10-10"))).toEqual("2110")
  });
});