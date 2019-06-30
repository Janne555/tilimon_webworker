import messageHandler from "./messageHandler";

export default class MessageQueue {
  constructor(postMessage) {
    this.messageQueue = []
    this.postMessage = postMessage
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
  
  onError = (error) => {
    throw error
  }

  nextMessage = () => {
    if (this.messageQueue.length < 1) {
      this.busy = false
      return
    }

    messageHandler(this.messageQueue.shift())
      .then(this.onFinish)
      .catch(this.onError)
  }
}