"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.log = log;
exports.logMessage = logMessage;

var _database = _interopRequireDefault(require("../database/database"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function log(tag, message) {
  const date = new Date();

  _database.default.log.put({
    tag,
    message,
    time: date.toDateString(),
    timestamp: date.getTime()
  });
}

function logMessage(tag, messageEvent) {
  const {
    queueId,
    method,
    table
  } = data();
  log(tag, `queueId: ${queueId}, method: ${method}, table: ${table}`);

  function data() {
    return messageEvent && messageEvent.data || {};
  }
}