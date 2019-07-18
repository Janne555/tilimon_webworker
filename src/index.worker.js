import MessageQueue from './MessageQueue'

const messageQueue = new MessageQueue(postMessage.bind(this))

onmessage = messageQueue.onMessage