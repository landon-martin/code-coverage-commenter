const core = require("@actions/core");
const { execSync } = require("child_process");
const { GitHub, context } = require("@actions/github");

const main = async () => {
  const repoName = context.repo.repo;
  const repoOwner = context.repo.owner;
  const gitHubToken = core.getInput("token");
  const covCommand = core.getInput("coverage-command") || "npm run test -- --coverage";

  const githubClient = new GitHub(gitHubToken);

  const parsePullRequestId = githubRef => {
    const result = /refs\/pull\/(\d+)\/merge/g.exec(githubRef);
    if (!result) throw new Error("Reference not found.");
    const [, pullRequestId] = result;
    return pullRequestId;
  };
  const prNumber = parsePullRequestId(process.env.GITHUB_REF);

  const fullReturn = execSync(covCommand).toString();
  let ccArray = fullReturn.split('\n');
  // Remove empty lines and command outputs
  ccArray = ccArray.filter((line) => !line.startsWith('>') && line !== '');
  // Remove the top and bottom bar of jest's cc table for proper formatting
  ccArray = ccArray.slice(1, ccArray.length -1 );
  const codeCoverage = ccArray.join('\n');

  const commentBody = `<details><summary>Unit Test Coverage Report</summary>
<br>

${codeCoverage}
</details>`;

  await githubClient.issues.createComment({
    repo: repoName,
    owner: repoOwner,
    body: commentBody,
    issue_number: prNumber,
  });
};

main().catch(err => core.setFailed(err.message));
