import MessageHandler from "./MessageHandler";

export default class MessageQueue {
  constructor(postMessage) {
    this.messageQueue = []
    this.postMessage = postMessage
    this.messageHandler = new MessageHandler()
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

    this.messageHandler.process(this.messageQueue.shift())
      .then(this.onFinish)
  }
}