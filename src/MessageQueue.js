import { messageHandler } from "./messageHandler";

export default class MessageQueue {
  constructor(postMessage, onError) {
    this.messageQueue = []
    this.postMessage = postMessage
    this.onError = onError
    this.busy = false
  }

  onMessage = (message) => {
    console.debug("received message", message)
    this.messageQueue.push(message)
    if (!this.busy)
      this.nextMessage()
  }

  onFinish = (result) => {
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

  handleMessage = (message) => {
    this.busy = true
    this.messageQueueId = message.data.queueId
    messageHandler(message)
      .then(this.onFinish)
      .catch(this.onError)
  }

  takeNextMessageInQueue = () => {
    return this.messageQueue.shift()
  }
}