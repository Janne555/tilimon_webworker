"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _dexie = _interopRequireDefault(require("dexie"));

var _constants = require("../constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const db = new _dexie.default("test");
db.version(1).stores({
  [_constants.EVENT_ROW]: `++id,${_constants.DATE},${_constants.AMOUNT},${_constants.EVENT_TYPE},${_constants.DESCRIPTION}`,
  [_constants.FILTER]: `++id`,
  [_constants.FILTER_GROUP]: `++id`,
  [_constants.TAG]: `++id,${_constants.NAME},${_constants.DESCRIPTION}`,
  [_constants.MODULE]: `++id`,
  log: '++id,time,timestamp,tag'
});
var _default = db;
exports.default = _default;