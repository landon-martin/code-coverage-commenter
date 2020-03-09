module.exports = () => {
  const eventPath = JSON.parse(process.env.GITHUB_EVENT_PATH)
  const pullRequestId = eventPath.pull_request.number
  return pullRequestId
}
