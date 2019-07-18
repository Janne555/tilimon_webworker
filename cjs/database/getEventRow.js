"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getEventRow = getEventRow;
exports.runFilter = runFilter;
exports.filterByDate = exports.filterByDescription = exports.filterByAmount = void 0;

var _database = _interopRequireDefault(require("./database"));

var _constants = require("../constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function getEventRow(filterGroupId, withTags) {
  let eventRows = await _database.default[_constants.EVENT_ROW].toArray();
  const filters = await getFilters();
  filters.forEach(filter => {
    eventRows = eventRows.filter(runFilter(filter));
  });

  if (withTags) {
    let tags = await _database.default[_constants.TAG].toCollection().toArray();
    return eventRows.map(eventRow => ({ ...eventRow,
      tags: tags.filter(tag => tag.description === eventRow.description)
    }));
  }

  return eventRows;

  async function getFilters() {
    if (!filterGroupId) return [];
    const filterGroup = await _database.default[_constants.FILTER_GROUP].get(filterGroupId);
    console.log(filterGroupId, filterGroup);
    if (!filterGroup) throw Error(`no filter group found by id: ${filterGroupId}`);
    return await _database.default[_constants.FILTER].where("id").anyOf(filterGroup.filterIds).toArray();
  }
}

function runFilter(filter) {
  return function (eventRow) {
    switch (filter.field) {
      case _constants.DATE:
        return filterByDate(eventRow, filter);

      case _constants.AMOUNT:
        return filterByAmount(eventRow, filter);

      case _constants.DESCRIPTION:
        return filterByDescription(eventRow, filter);

      default:
        throw Error("unknown field for filter");
    }
  };
}

const filterByAmount = (eventRow, {
  comparisonOperator,
  value
}) => {
  switch (comparisonOperator) {
    case _constants.EQUALS:
      return eventRow.amount === value;

    case _constants.GTE:
      return eventRow.amount >= value;

    case _constants.LTE:
      return eventRow.amount <= value;

    default:
      throw new Error(`invalid comparison operator: ${comparisonOperator}`);
  }
};

exports.filterByAmount = filterByAmount;

const filterByDescription = (eventRow, {
  restrictionGroup,
  descriptions
}) => {
  const hits = descriptions.filter(description => eventRow.description === description);

  switch (restrictionGroup) {
    case _constants.EQUALS:
      return hits.length === descriptions.length;

    case _constants.ANY_OF:
      return hits.length >= 1;

    case _constants.NONE_OF:
      return hits.length === 0;

    default:
      throw Error("invalid restriction group");
  }
};

exports.filterByDescription = filterByDescription;

const filterByDate = (eventRow, {
  comparisonOperator,
  date
}) => {
  switch (comparisonOperator) {
    case _constants.EQUALS:
      return eventRow.date === date;

    case _constants.GTE:
      return eventRow.date >= date;

    case _constants.LTE:
      return eventRow.date <= date;

    default:
      throw new Error("invalid comparison operator");
  }
};

exports.filterByDate = filterByDate;