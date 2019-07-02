import { PUT, GET, DELETE, CALCULATE } from "./constants";
import { getHandler } from "./database/getHandler";
import { putHandler } from "./database/putHandler";
import { calculationHandler } from "./calculators/calculationHandler";

export function messageHandler({ data }) {
  switch (data.method) {
    case PUT:
      return putHandler(data)
    case GET:
      return getHandler(data)
    case DELETE:
      throw Error("not implemented yet")
    case CALCULATE:
      return calculationHandler(data)
    default:
      throw Error("method not recognized")
  }
}
