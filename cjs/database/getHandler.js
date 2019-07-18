"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getHandler = getHandler;

var _constants = require("../constants");

var _getEventRow = require("./getEventRow");

var _database = _interopRequireDefault(require("./database"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getHandler({
  table,
  filterGroupId
}) {
  switch (table) {
    case _constants.EVENT_ROW:
      return (0, _getEventRow.getEventRow)(filterGroupId);

    case _constants.FILTER:
    case _constants.FILTER_GROUP:
    case _constants.TAG:
    case _constants.MODULE:
      return _database.default[table].toCollection().toArray();

    default:
      throw Error("tried to get from table that is undefined");
  }
}