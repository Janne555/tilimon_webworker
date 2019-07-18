"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _messageHandler = require("./messageHandler");

var _logger = require("./logger");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class MessageQueue {
  constructor(postMessage, onError) {
    _defineProperty(this, "onMessage", message => {
      (0, _logger.logMessage)("onMessage", message);
      this.messageQueue.push(message);
      if (!this.busy) this.nextMessage();
    });

    _defineProperty(this, "onFinish", result => {
      (0, _logger.log)("onFinish", `queueId: ${this.messageQueueId}`);
      this.postMessage({
        result,
        queueId: this.messageQueueId
      });
      this.nextMessage();
    });

    _defineProperty(this, "nextMessage", () => {
      if (this.messageQueue.length < 1) {
        this.busy = false;
        return;
      }

      this.handleMessage(this.takeNextMessageInQueue());
    });

    _defineProperty(this, "handleError", error => {
      (0, _logger.log)('messageQueueErrorHandler', error.message);
      this.onError(error);
    });

    _defineProperty(this, "handleMessage", message => {
      this.busy = true;
      this.messageQueueId = message.data.queueId;
      (0, _messageHandler.messageHandler)(message).then(this.onFinish).catch(this.handleError);
    });

    _defineProperty(this, "takeNextMessageInQueue", () => {
      return this.messageQueue.shift();
    });

    this.messageQueue = [];
    this.postMessage = postMessage;
    this.onError = onError;
    this.busy = false;
  }

}

exports.default = MessageQueue;