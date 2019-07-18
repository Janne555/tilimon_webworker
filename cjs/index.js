"use strict";

var _MessageQueue = _interopRequireDefault(require("./MessageQueue"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const messageQueue = new _MessageQueue.default(postMessage.bind(void 0));
onmessage = messageQueue.onMessage;