import { putHandler } from "../putHandler";
import { EVENT_ROW, SINGLE, TABLES, BULK } from "../../constants";
import db from "../database";

describe('putHandler', () => {
  beforeEach(async () => {
    await Promise.all(TABLES.map(table => db[table].clear()))
  })

  it('should handle single put', async () => {
    const results = await putHandler({ table: EVENT_ROW, mode: SINGLE, payload: { description: "moi" } })
    const sansId = results.map(result => {
      const { id, ...rest } = result
      return rest
    })
    expect(sansId).toEqual([{ description: "moi" }])
  });

  it('should handle bulk put', async () => {
    const results = await putHandler({ table: EVENT_ROW, mode: BULK, payload: [{ description: "moi" }, { description: "hei" }, { description: "tere" }] })
    const sansId = results.map(result => {
      const { id, ...rest } = result
      return rest
    })
    expect(sansId).toEqual([{ description: "moi" }, { description: "hei" }, { description: "tere" }])
  });

  it('should throw if table is unknown', async () => {
    try {
      await putHandler({ table: "asd" })
    } catch (error) {
      expect(error.message).toEqual("table not found")
    }
  });

  it('should throw if mode is unknown', async () => {
    try {
      await putHandler({ table: EVENT_ROW, mode: "asd" })
    } catch (error) {
      expect(error.message).toEqual("invalid mode")
    }
  });
});