"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.putHandler = putHandler;

var _constants = require("../constants");

var _database = _interopRequireDefault(require("./database"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function putHandler({
  table,
  mode,
  payload
}) {
  if (!_constants.TABLES.includes(table)) throw Error("table not found");

  switch (mode) {
    case _constants.SINGLE:
      return single();

    case _constants.BULK:
      return bulk();

    default:
      throw Error("invalid mode");
  }

  async function single() {
    await _database.default[table].put(payload);
    return await _database.default[table].toCollection().toArray();
  }

  async function bulk() {
    await _database.default[table].bulkPut(payload);
    return await _database.default[table].toCollection().toArray();
  }
}