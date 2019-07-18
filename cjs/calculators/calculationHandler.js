"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.calculationHandler = calculationHandler;
exports.sum = sum;
exports.average = average;
exports.groupedSum = groupedSum;
exports.groupedAverage = groupedAverage;
exports.totalSum = totalSum;
exports.totalAverage = totalAverage;
exports.groupEventRows = groupEventRows;
exports.dayGroupKey = dayGroupKey;
exports.weekGroupKey = weekGroupKey;
exports.monthGroupKey = monthGroupKey;
exports.yearGroupKey = yearGroupKey;

var _getHandler = require("../database/getHandler");

var _constants = require("../constants");

var _get_iso_week = _interopRequireDefault(require("date-fns/get_iso_week"));

var _get_iso_year = _interopRequireDefault(require("date-fns/get_iso_year"));

var _get_date = _interopRequireDefault(require("date-fns/get_date"));

var _get_month = _interopRequireDefault(require("date-fns/get_month"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function calculationHandler({
  filterGroupId,
  grouping,
  calculation
}) {
  switch (calculation) {
    case _constants.SUM:
      return groupedSum(groupEventRows(grouping, (await (0, _getHandler.getHandler)({
        table: _constants.EVENT_ROW,
        filterGroupId
      }))));

    case _constants.AVERAGE:
      return groupedAverage(groupEventRows(grouping, (await (0, _getHandler.getHandler)({
        table: _constants.EVENT_ROW,
        filterGroupId
      }))));

    case _constants.TOTAL_SUM:
      return totalSum(groupEventRows(grouping, (await (0, _getHandler.getHandler)({
        table: _constants.EVENT_ROW,
        filterGroupId
      }))));

    case _constants.TOTAL_AVERAGE:
      return totalAverage(groupEventRows(grouping, (await (0, _getHandler.getHandler)({
        table: _constants.EVENT_ROW,
        filterGroupId
      }))));

    default:
      throw Error("unknown calculation");
  }
}

function sum(eventRows, getAmount) {
  return eventRows.reduce((sum, curr) => sum + getAmount(curr), 0);
}

function average(eventRows, getAmount) {
  return eventRows.reduce((acc, curr, index, array) => {
    if (index === array.length - 1) return (acc + getAmount(curr)) / array.length;
    return acc + getAmount(curr);
  }, 0);
}

function groupedSum(groupedEventRows) {
  return groupedEventRows.map(group => sum(group, eventRow => eventRow.amount));
}

function groupedAverage(groupedEventRows) {
  return groupedEventRows.map(group => average(group, eventRow => eventRow.amount));
}

function totalSum(groupedEventRows) {
  return sum(groupedSum(groupedEventRows), amount => amount);
}

function totalAverage(groupedEventRows) {
  return average(groupedSum(groupedEventRows), amount => amount);
}

function groupEventRows(grouping, eventRows) {
  switch (grouping) {
    case _constants.DAY:
      return partitionEventRows(dayGroupKey);

    case _constants.WEEK:
      return partitionEventRows(weekGroupKey);

    case _constants.MONTH:
      return partitionEventRows(monthGroupKey);

    case _constants.YEAR:
      return partitionEventRows(yearGroupKey);

    case undefined:
      return [eventRows];

    default:
      throw Error("unknown grouping");
  }

  function partitionEventRows(generateGroupKey) {
    let groupedEventRows = {};
    eventRows.forEach(eventRow => pushToGroup(eventRow, generateGroupKey(new Date(eventRow.date))));
    return Object.values(groupedEventRows);

    function pushToGroup(eventRow, groupKey) {
      if (!(groupKey in groupedEventRows)) groupedEventRows[groupKey] = [];
      groupedEventRows[groupKey].push(eventRow);
    }
  }
}

function dayGroupKey(date) {
  return `${(0, _get_date.default)(date)}${(0, _get_month.default)(date)}${(0, _get_iso_year.default)(date)}`;
}

function weekGroupKey(date) {
  return `${(0, _get_iso_week.default)(date)}${(0, _get_iso_year.default)(date)}`;
}

function monthGroupKey(date) {
  return `${(0, _get_month.default)(date)}${(0, _get_iso_year.default)(date)}`;
}

function yearGroupKey(date) {
  return `${(0, _get_iso_year.default)(date)}`;
}