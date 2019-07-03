import Worker from './main.worker.js'
const worker = new Worker();

let buffer = []

worker.onmessage = function (value) {
  buffer.shift()(value)
}

function postMessage(message) {
  worker.postMessage(message)
  return new Promise(resolve => {
    buffer.push(resolve)
  })
}

export { postMessage }