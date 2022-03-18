# js-pipeline

## Build action

Parameters:

* `framework` (optional, string, 'react' | 'angular')
  * if not defined, use angular if angular.json is present, otherwise use react
* `ssr` (optional, boolean, defaults to false)
* `package_manager` (optional, string, 'npm' | 'yarn')
  * if not defined, use npm if `package-lock.json` is present, otherwise use yarn
* `node_version` (optional, string)
  * should generally be left undefined - it will default to the `.node-version` file in the root of the project
* `slack_notification_channel` (optional, string)
  * if defined, a slack notification will be sent to this channel
* `notify_on` (optional, string, 'success' | 'failure' | 'always')
  * defaults to 'failure'
* `ci_steps` (optional, array of strings)
  * if defined, these steps will be run in the CI environment

Secrets:
* `VAULT_ADDR`
* `VAULT_AUTH_METHOD`
* `VAULT_AUTH_ROLE_ID`
* `VAULT_AUTH_SECRET_ID`
* `ADDITIONAL_VARIABLES` - in a JSON format

Steps to make:
* Pull repo
* Prepare node
* Install dependencies
* Run audit (optional)
* Run linters (optional)
* Run tests (optional)
* Build
* Prepare artifacts
* Notify

## Deploy action

Parameters:
* `slack_notification_channel` (optional, string)
  * if defined, a slack notification will be sent to this channel
* `notify_on` (optional, string, 'success' | 'failure' | 'always')
  * defaults to 'failure'
* `deployers` (optional, array of strings)
  * list of github users allowed to start the deploy manually

Secrets:
* `SSH_PRIVATE_KEY`
* `SLACK_BOT_TOKEN`
* `ADDITIONAL_VARIABLES` - in a JSON format

Steps to make:
* Get artifacts from the build action
* Deploy
* Notify
