const core = require('@actions/core')
const { execSync } = require('child_process')
const { GitHub, context } = require('@actions/github')

function isTableRow (line) {
  return line && typeof line === 'string' ? line.match(/^[-|]*$/) && line !== '' : false
}

function grabTableData (output) {
  let ccArray = output.split('\n')
  // Remove empty lines and command outputs
  let tableRowCount = 0
  ccArray = ccArray.filter((line) => {
    if (isTableRow(line)) {
      tableRowCount++
    }
    return tableRowCount < 3 && tableRowCount > 0
  })
  ccArray = ccArray.slice(1, ccArray.length)
  return ccArray.join('\n')
}

function getPrId (githubRef) {
  const result = /refs\/pull\/(\d+)\/merge/g.exec(githubRef)
  if (!result) throw new Error('Reference not found.')
  const [, pullRequestId] = result
  return pullRequestId
}

function createComment (table) {
  return `<details><summary>Unit Test Coverage Report</summary>
<br>

${table}
</details>`
}

const main = async () => {
  // Setup the context
  const repoName = context.repo.repo
  const repoOwner = context.repo.owner
  // Grab the action inputs
  const gitHubToken = core.getInput('token')
  const covCommand = core.getInput('coverage-command') || 'npm run test -- --coverage'

  const githubClient = new GitHub(gitHubToken)

  const prNumber = getPrId(process.env.GITHUB_REF)

  const fullReturn = execSync(covCommand).toString()
  const codeCoverageTable = grabTableData(fullReturn)

  const commentBody = createComment(codeCoverageTable)

  await githubClient.issues.createComment({
    repo: repoName,
    owner: repoOwner,
    body: commentBody,
    issue_number: prNumber
  })
}

main().catch(err => core.setFailed(err.message))

module.exports.grabTableData = grabTableData
