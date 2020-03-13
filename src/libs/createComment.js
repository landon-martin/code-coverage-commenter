const { GitHub } = require('@actions/github')

function generateComment (title, table) {
  return `<details><summary>${title}</summary>
<br>

${table}
</details>`
}

async function createCommentOnPR (token, comment) {
  // createComment API only allows 65536 chars
  if (comment.commentBody.length > 65536) {
    console.warn('Comment Body is too large, truncating')
    comment.commentBody = comment.commentBody.slice(0, 65535)
  }
  const githubClient = new GitHub(token)

  await githubClient.issues.createComment(comment)
}

module.exports = {
  generateComment,
  createCommentOnPR
}
