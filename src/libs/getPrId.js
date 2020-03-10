const fs = require('fs')

module.exports = () => {
  if (process.env.GITHUB_EVENT_PATH === undefined) {
    throw new Error('process.env.GITHUB_EVENT_PATH is not defined, cannot get PR id.')
  }
  const eventPath = JSON.parse(
    fs.readFileSync(process.env.GITHUB_EVENT_PATH, 'utf8')
  )
  const pullRequestId = eventPath.pull_request.number
  return pullRequestId
}
