jest.mock('fs')

const getPrId = require('./getPrId')

test('Grab pr from GITHUB_EVENT_PATH', () => {
  process.env.GITHUB_EVENT_PATH = '{ pull_request: { number: "123" } }'
  jest.spyOn(JSON, 'parse').mockReturnValue({ pull_request: { number: '123' } })
  const expectedPR = '123'
  const prId = getPrId()
  expect(expectedPR).toEqual(prId)
})

test('Throws when GITHUB_EVENT_PATH not defined', () => {
  jest.resetModules()
  delete process.env.GITHUB_EVENT_PATH
  expect(() => getPrId()).toThrowError()
})
