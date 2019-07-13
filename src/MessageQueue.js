import { messageHandler } from "./messageHandler";
import { logMessage, log } from "./logger";

export default class MessageQueue {
  constructor(postMessage, onError) {
    this.messageQueue = []
    this.postMessage = postMessage
    this.onError = onError
    this.busy = false
  }

  onMessage = (message) => {
    logMessage("onMessage", message)
    this.messageQueue.push(message)
    if (!this.busy)
      this.nextMessage()
  }

  onFinish = (result) => {
    log("onFinish", `queueId: ${this.messageQueueId}`)
    this.postMessage({ result, queueId: this.messageQueueId })
    this.nextMessage()
  }

  nextMessage = () => {
    if (this.messageQueue.length < 1) {
      this.busy = false
      return
    }

    this.handleMessage(this.takeNextMessageInQueue())
  }

  handleError = (error) => {
    log('messageQueueErrorHandler', error.message)
    this.onError(error)
  }

  handleMessage = (message) => {
    this.busy = true
    this.messageQueueId = message.data.queueId
    messageHandler(message)
      .then(this.onFinish)
      .catch(this.handleError)
  }

  takeNextMessageInQueue = () => {
    return this.messageQueue.shift()
  }
}