const core = require('@actions/core')
const github = require('@actions/github')

const grabTableData = require('./libs/grabTableData')
const getPrId = require('./libs/getPrId')
const generateComment = require('./libs/generateComment')
const runCoverageCommand = require('./libs/runCoverageCommand')

const main = async () => {
  // Grab the action inputs
  const gitHubToken = core.getInput('token')
  const covCommand = core.getInput('coverage-command') || 'npm run test -- --coverage'
  const title = core.getInput('comment-title') || 'Unit Test Coverage Report'
  const workingDir = core.getInput('working-dir')

  const fullReturn = await runCoverageCommand(covCommand, workingDir)

  try {
    const prNumber = getPrId()
    const codeCoverageTable = grabTableData(fullReturn)
    const commentBody = generateComment(title, codeCoverageTable)

    const octokit = github.getOctokit(gitHubToken)

    await octokit.issues.createComment({
      ...github.context.repo,
      body: commentBody,
      issue_number: prNumber
    })
  } catch (e) {
    console.error('Failed to create comment on PR')
    console.error(e)
  }
}

main().catch(err => core.setFailed(err.message))
