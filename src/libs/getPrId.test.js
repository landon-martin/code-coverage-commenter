const getPrId = require('./getPrId')

test('Grab pr from GITHUB_EVENT_PATH', () => {
  jest.spyOn(JSON, 'parse').mockReturnValue({ pull_request: { number: '123' } })
  const expectedPR = '123'
  const prId = getPrId()
  expect(expectedPR).toEqual(prId)
})
