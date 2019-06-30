const Dexie = require('dexie')

Dexie.dependencies.indexedDB = require('fake-indexeddb')
Dexie.dependencies.IDBKeyRange = require('fake-indexeddb/lib/FDBKeyRange')

//eslint-disable-next-line
global.flushPromises = function flushPromises() {
  return new Promise(resolve => {
    //eslint-disable-next-line
    setImmediate(resolve())
  })
}