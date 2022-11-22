# JS Pipeline for GitHub Actions

## Available jobs

| Job name | Description |
| --- | --- |
| `lint` | Runs `npm run lint` |
| `test` | Runs `npm run test` |
| `jest` | Runs Jest tests with coverage comparison (useful for PRs) |
| `audit` | Runs `npm run audit` |
| `build` | Builds the app |
| `deploy` | Deploys the app |
| `analyze` | Runs a bundle analysis and comparison with the target branch (Next.js, WIP) |

## How to use it

### Inputs

Inputs that should be defined in the workflow file:

| property | description | Relevant jobs | required | default |
| --- | --- | --- | --- | --- |
| `ci_steps` | Steps to run in the workflow, as a space separated string. Possible values are in a separate section above | all | true | N/A |
| `workflow` | Path to the current workflow file | `analyze` | false | N/A |
| `secrets` | Name of the vault to be used | `deploy`, `build` | false | N/A |
| `deploy_host` | Host to deploy to | `deploy` | false | N/A |
| `deploy_token` | Path where the app is deployed on the server | `deploy` | false | N/A |
| `deploy_user` | User to deploy as | `deploy` | false | N/A |
| `deploy_port` | Port of the deploy server | `deploy` | false | N/A |
| `slack_notification_channel` | Slack channel to send notifications to. | `deploy` | false | `null` |
| `notify_on` | When to send notifications. Possible values are `success`, `failure` and `all` | `deploy` | false | `all` |
| `environment` | Environment to deploy to | `deploy` | true | N/A |

Inputs that may be defined in the workflow file, but have defaults that are usually fine:

| property | description | Relevant jobs | required | default |
| --- | --- | --- | --- | --- |
| `runner` | Runner to use for the action (OS/version). | all | false | `ubuntu-latest` |
| `package_manager` | Package manager to use for the action. | all | false | Yarn if `yarn.lock` is present, npm otherwise |
| `node_version` | Node.js version to use. | all | false | The one defined in `.node-version` |
| `framework` | Project type - supported values are `angular`, `react`, `next` and `node` | all | false | `angular` if `angular.json` present in root, `next` if `next.config.js` present in root, otherwise `react` |
| `deploy_to` | Path where the app is deployed on the server | `deploy` | false | `/home/{{deploy_user}}/www/{{deploy_host}}` |
| `newrelic` | Should we run server-side newrelic | `deploy` | false | `true` if `newrelic.js` exists in project root, `false` otherwise |
| `ssr` | Whether to build the app in SSR mode. | `deploy` | false | `true` if framework is next, `false` otherwise |


### Secrets
| property | description | required |
| --- | --- | --- |
| `VAULT_ADDR` | Vault URL | false |
| `VAULT_AUTH_METHOD` | Vault auth method | false |
| `VAULT_AUTH_ROLE_ID` | Vault auth role ID | false |
| `VAULT_AUTH_SECRET_ID` | Vault auth secret ID | false |
| `SSH_PRIVATE_KEY` | Private SSH key used for deployment | false |
| `SLACK_BOT_TOKEN` | Slack bot token for notifications | false |
| `ADDITIONAL_VARIABLES` | Additional ENV variables to pass to the pipeline (in a serialized JSON) | false |

## Recipes

### Next.js with standalone build

In order to prepare for deployment, the following script should be present in `package.json`:

```json
{
  "scripts": {
    "build": "next build; cp -r ./public .next/standalone/public; mkdir ./.next/standalone/public/_next; cp -r ./.next/static ./.next/standalone/public/_next/static; mv ./.next/standalone/server.js ./.next/standalone/index.js; cp ./next.config.js ./.next/standalone/next.config.js"
  }
}
```

#### Example build config

```yaml
# .github/workflows/pr.yml
name: Build

on:
  pull_request:

jobs:
  test-analyze:
    name: 'Run'
    uses: ./.github/workflows/build.yml
    with:
      ci_steps: 'lint test analyze'
      workflow: '.github/workflows/pr.yml'

```

#### Example deploy config

```yaml
# .github/workflows/deploy_staging.yml
name: Deploy staging

on:
  workflow_dispatch:
  push:
    branches:
      - staging

jobs:
  deploy:
    name: Deploy
    uses: ./.github/workflows/build.yml
    with:
      ci_steps: 'deploy'
      secrets: 'js-my-project'
      deploy_host: project-name.byinfinum.co
      deploy_user: 'js-project-name'
    secrets:
      ADDITIONAL_VARIABLES: '{}'
      SSH_PRIVATE_KEY: ${{ secrets.STAGING_KEY }}
      VAULT_ADDR: ${{ secrets.VAULT_ADDR }}
      VAULT_AUTH_METHOD: ${{ secrets.VAULT_AUTH_METHOD }}
      VAULT_AUTH_ROLE_ID: ${{ secrets.VAULT_AUTH_ROLE_ID }}
      VAULT_AUTH_SECRET_ID: ${{ secrets.VAULT_AUTH_SECRET_ID }}
```

### Other projects

Other projects are not yet supported. Check the [Productive project](https://app.productive.io/1-infinum/projects/1186/tasks?board=58094&filter=LTE%3D) for more info or to open a task.

## Contributing

For more details about the implementation, check the [CONTRIBUTING.md](CONTRIBUTING.md) file.