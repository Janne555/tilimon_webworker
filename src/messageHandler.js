import { PUT, GET, DELETE } from "./constants";
import { getHandler } from "./database/getHandler";
import { putHandler } from "./database/putHandler";

export function messageHandler({ data }) {
  switch (data.method) {
    case PUT:
      return putHandler(data)
    case GET:
      return getHandler(data)
    case DELETE:
      throw Error("not implemented yet")
    default:
      throw Error("method not recognized")
  }
}
