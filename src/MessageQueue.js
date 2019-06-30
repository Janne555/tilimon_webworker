import { messageHandler } from "./messageHandler";

export default class MessageQueue {
  constructor(postMessage, onError) {
    this.messageQueue = []
    this.postMessage = postMessage
    this.onError = onError
    this.busy = false
  }

  onMessage = (message) => {
    this.messageQueue.push(message)
    if (!this.busy)
      this.nextMessage()
  }

  onFinish = (result) => {
    this.postMessage(result)
    this.nextMessage()
  }

  nextMessage = () => {
    if (this.messageQueue.length < 1) {
      this.busy = false
      return
    }

    this.busy = true
    messageHandler(this.messageQueue.shift())
      .then(this.onFinish)
      .catch(this.onError)
  }
}