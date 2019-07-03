import 'jsdom-worker'
import { postMessage } from "..";
import { PUT, EVENT_ROW, SINGLE } from "../constants";

describe('Name of the group', () => {
  it('should ', async () => {
    const result = await postMessage({ method: PUT, table: EVENT_ROW, mode: SINGLE, payload: { date: Date.now(), amount: 13.32, eventType: "korttimaksu", description: "lounas" } })
    expect(result).toEqual()
  });
});