import MessageQueue from '../MessageQueue'
const messageHandler = require('../messageHandler')

describe('MessageQueue', () => {
  const messageHandlerMock = jest.fn().mockImplementation((value) => Promise.resolve(value))
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
    messageQueue.onMessage("moi")
    expect(messageHandlerMock).toHaveBeenCalled()
    //eslint-disable-next-line
    await flushPromises()
    expect(postMessageMock).toHaveBeenCalledWith("moi")
  });

  it('should handle multiple messages in correct order', async () => {
    messageQueue.onMessage("moi")
    messageHandlerMock.mockImplementationOnce(value => new Promise(resolve => setTimeout(() => resolve(value), 100)))
    messageQueue.onMessage("moro")
    messageQueue.onMessage("tere")
    //eslint-disable-next-line
    await new Promise(resolve => setTimeout(() => resolve(), 200))
    expect(postMessageMock.mock.calls).toEqual([["moi"], ["moro"], ["tere"]])
  });

  it('should throw error', async () => {
    messageHandlerMock.mockImplementationOnce(() => {
      return new Promise(() => {
        throw Error()
      })
    })
    messageQueue.onMessage("moi")
    //eslint-disable-next-line
    await flushPromises()
    expect(onErrorMock).toHaveBeenCalled()
  });
});