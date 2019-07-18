"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.messageHandler = messageHandler;

var _constants = require("./constants");

var _getHandler = require("./database/getHandler");

var _putHandler = require("./database/putHandler");

var _calculationHandler = require("./calculators/calculationHandler");

function messageHandler({
  data
}) {
  switch (data.method) {
    case _constants.PUT:
      return (0, _putHandler.putHandler)(data);

    case _constants.GET:
      return (0, _getHandler.getHandler)(data);

    case _constants.DELETE:
      throw Error("not implemented yet");

    case _constants.CALCULATE:
      return (0, _calculationHandler.calculationHandler)(data);

    default:
      throw Error("method not recognized");
  }
}