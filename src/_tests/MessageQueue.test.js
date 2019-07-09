import MessageQueue from '../MessageQueue'
const messageHandler = require('../messageHandler')

describe('MessageQueue', () => {
  const messageHandlerMock = jest.fn().mockImplementation((value) => Promise.resolve(value.data.message))
  jest.spyOn(messageHandler, 'messageHandler').mockImplementation(messageHandlerMock)

  const postMessageMock = jest.fn()
  const onErrorMock = jest.fn()
  let messageQueue

  beforeEach(() => {
    messageHandlerMock.mockClear()
    postMessageMock.mockClear()
    onErrorMock.mockClear()
    messageQueue = new MessageQueue(postMessageMock, onErrorMock)
  })

  it('should handle a message', async () => {
    messageQueue.onMessage({ data: { queueId: "foo", message: "moi" } })
    expect(messageHandlerMock).toHaveBeenCalled()
    //eslint-disable-next-line
    await flushPromises()
    expect(postMessageMock).toHaveBeenCalledWith({ queueId: "foo", result: "moi" })
  });

  it('should handle multiple messages in correct order', async () => {
    messageQueue.onMessage({ data: { queueId: "foo", message: "moi" } })
    messageHandlerMock.mockImplementationOnce(value => new Promise(resolve => setTimeout(() => resolve(value.data.message), 100)))
    messageQueue.onMessage({ data: { queueId: "bar", message: "moro" } })
    messageQueue.onMessage({ data: { queueId: "baz", message: "tere" } })
    //eslint-disable-next-line
    await new Promise(resolve => setTimeout(() => resolve(), 200))
    expect(postMessageMock.mock.calls).toEqual([[{ queueId: "foo", result: "moi" }], [{ queueId: "bar", result: "moro" }], [{ queueId: "baz", result: "tere" }]])
  });

  it('should throw error', async () => {
    messageHandlerMock.mockImplementationOnce(() => {
      return new Promise(() => {
        throw Error()
      })
    })
    messageQueue.onMessage({ data: { queueId: "foo", message: "moi" } })
    //eslint-disable-next-line
    await flushPromises()
    expect(onErrorMock).toHaveBeenCalled()
  });
});