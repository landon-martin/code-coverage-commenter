const exec = require('@actions/exec')

module.exports = async (command, workingDir = '.') => {
  let fullReturn = ''

  const options = {}
  options.listeners = {
    stdout: (data) => {
      fullReturn += data.toString()
    },
    stderr: (data) => {
      fullReturn += data.toString()
    }
  }
  options.cwd = workingDir
  await exec.exec(command, [], options)

  return fullReturn
}
