const core = require('@actions/core')
const exec = require('@actions/exec')
const { GitHub, context } = require('@actions/github')

const grabTableData = require('./libs/grabTableData')
const getPrId = require('./libs/getPrId')
const createComment = require('./libs/createComment')

const main = async () => {
  // Setup the context
  const repoName = context.repo.repo
  const repoOwner = context.repo.owner
  // Grab the action inputs
  const gitHubToken = core.getInput('token')
  const covCommand = core.getInput('coverage-command') || 'npm run test -- --coverage'
  const title = core.getInput('comment-title') || 'Unit Test Coverage Report'
  const workingDir = core.getInput('working-dir')

  const githubClient = new GitHub(gitHubToken)

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
  await exec.exec(covCommand, [], options)

  try {
    if (process.env.GITHUB_REF) {
      const prNumber = getPrId()
      const codeCoverageTable = grabTableData(fullReturn)
      const commentBody = createComment(title, codeCoverageTable)

      await githubClient.issues.createComment({
        repo: repoName,
        owner: repoOwner,
        body: commentBody,
        issue_number: prNumber
      })
    } else {
      console.warn('GITHUB_REF not found, not commenting.')
    }
  } catch (e) {
    console.error('Failed to create comment on PR')
    console.error(e)
  }
}

main().catch(err => core.setFailed(err.message))
