const runCoverageCommand = require('./runCoverageCommand')

test('Throw on failed command', async () => {
  const command = 'exit -1'
  await expect(runCoverageCommand(command)).rejects.toThrow()
})

test('Dont throw on succeeded command', async () => {
  const command = 'exit 0'
  await expect(runCoverageCommand(command)).rejects.toThrow()
})
