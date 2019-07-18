import Worker from './index.worker.js'
import shortid from 'shortid'

let resolveQueue = {}

const worker = new Worker()

worker.onmessage = function resolveMessage({ data: { result, queueId } }) {
  resolveQueue[queueId](result)
  delete resolveQueue[queueId]
}


export function postMessage(message) {
  const id = shortid.generate()
  worker.postMessage({ ...message, queueId: id })
  return new Promise(resolve => {
    resolveQueue[id] = resolve
  })
}
