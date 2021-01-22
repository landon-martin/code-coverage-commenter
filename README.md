# landon-martin/code-coverage-commenter
This GitHub Action runs unit tests and comments on the PR with a markdown table of the code coverage.

## Currently Supported Test Tools
- Jest

## Usage
### Pre-requisites
Create a workflow `.yml` file in your `.github/workflows` directory. An [example workflow](https://github.com/landon-martin/code-coverage-commenter/new/develop?readme=1#example-workflow) is available below. For more information, reference the GitHub Help Documentation for [Creating a workflow file](https://help.github.com/en/articles/configuring-a-workflow#creating-a-workflow-file).

### Inputs
- `token`: The GitHub Token in for your repo, usually passed using $ {{ secrets.GITHUB_TOKEN }}
- `coverage-command`: The Command which will generate the coverage table to be parsed. Ex. `npm run test -- --coverage`
- `comment-title`: The summary title of the comment posted on the PR, defaults to ''Unit Test Coverage Report'
- `working-dir`: The directory to execute the command in. Note, using `cd` in side the coverage-command will cause issues.

## Example Workflow
On every pull request created against develop, run unit tests.
```yaml
name: Jest Preflight Check

on:
  pull_request:
    branches: [develop]

jobs:
  build:
    name: jest_preflight
    runs-on: ubuntu-18.04
    steps:
      - uses: actions/checkout@v2
      - name: Use Node.js
        uses: actions/setup-node@v1
        with:
          node-version: 14.x
      - name: npm install
        run: |
          npm install
      - name: Run Jest Tests
        uses: landon-martin/code-coverage-commenter@v0.0.9
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          coverage-command: "npm run test -- --coverage"
          comment-title: "Source Unit Test Coverage Report"
          working-dir: "test/e2e/page_objects"
```
This will run checkout the branch, navigate to `test/e2e/page_objects` and run the command `npm run test -- --coverage`, then parse the output of the code coverage and post it back to the PR that triggered it.
