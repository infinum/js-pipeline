# JS Pipeline for GitHub Actions

## Available jobs

| Job name | Description |
| --- | --- |
| `lint` | Runs `npm run lint` |
| `test` | Runs `npm run test` |
| `jest` | Runs Jest tests with coverage comparison (useful for PRs) |
| `audit` | Runs `npm run audit` |
| `build-next` | Builds Next.js app |
| `deploy-next-ssr` | Deploys Next.js app with SSR |
| `analyze` | Runs a bundle analysis and comparison with the target branch (Next.js) |

## How to use it

### Inputs

| property | description | Relevant jobs | required | default |
| --- | --- | --- | --- | --- |
| `runner` | Runner to use for the action (OS/version). | all | false | `ubuntu-latest` |
| `package_manager` | Package manager to use for the action. | all | false | Yarn if `yarn.lock` is present, npm otherwise |
| `node_version` | Node.js version to use. | all | false | The one defined in `.node-version` |
| `ci_steps` | Steps to run in the workflow, as a space separated string. Possible values are in a separate section above | all | true | N/A |
| `features` | Features to enable, possible values right now are `''` and `'secrets'` | `deploy-next-ssr` | false | `''` |
| `deploy_host` | Host to deploy to | `deploy-next-ssr` | false | N/A |
| `deploy_token` | Path where the app is deployed on the server | `deploy-next-ssr` | false | N/A |
| `deploy_user` | User to deploy as | `deploy-next-ssr` | false | N/A |
| `workflow` | Path to the current workflow file | `analyze` | false | N/A |

#### Inputs that are not currently used, but might be in the future

| property | description | required | default |
| --- | --- | --- | --- |
| `framework` | Project type - React or Angular | false | `angular` if `angular.json` present in root, otherwise `react` |
| `ssr` | Whether to build the app in SSR mode. | false | `false` |
| `slack_notification_channel` | Slack channel to send notifications to. | false | `null` |
| `notify_on` | When to send notifications. Possible values are `success`, `failure` and `all` | false | `all` |

### Secrets
| property | description | required |
| --- | --- | --- |
| `VAULT_ADDR` | Vault URL | false |
| `VAULT_AUTH_METHOD` | Vault auth method | false |
| `VAULT_AUTH_ROLE_ID` | Vault auth role ID | false |
| `VAULT_AUTH_SECRET_ID` | Vault auth secret ID | false |
| `SSH_PRIVATE_KEY` | Private SSH key used for deployment | false |
| `SLACK_BOT_TOKEN` | Slack bot token for notifications (not yet used) | false |
| `ADDITIONAL_VARIABLES` | Additional ENV variables to pass to the pipeline (in a serialized JSON) | false |

## Recipes

### Next.js with standalone build

In order to prepare for deployment, the following script should be present in `package.json`:

```json
{
  "scripts": {
    "build": "next build; cp -r ./public .next/standalone/public; mkdir ./.next/standalone/public/_next; cp -r ./.next/static ./.next/standalone/public/_next/static; mv ./.next/standalone/server.js ./.next/standalone/index.js; cp ./newrelic.js ./.next/standalone/newrelic.js; cp ./next.config.js ./.next/standalone/next.config.js"
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
      ci_steps: 'lint test build-next analyze'
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
      ci_steps: 'deploy-next-ssr'
      features: 'secrets'
      deploy_host: project-name.byinfinum.co
      deploy_to: '/home/js-project-name/www/project-name.byinfinum.co'
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

## Custom actions

### Bootstrap Next.js

This action is used to install and cache Next.js dependencies specifically for Next.js projects.

| property | description | required | default |
| --- | --- | --- | --- |
| `runner` | Runner to use for the action (OS/version). | false | `ubuntu-latest` |
| `package_manager` | Package manager to use for the action. | false | Yarn if `yarn.lock` is present, npm otherwise |
| `node_version` | Node.js version to use. | false | The one defined in `.node-version` |
| `env_vars` | Environment variables to set (in a stringified JSON object). | false | `"{}"` |

### Analyze Next.js bundle size (WIP)

This action is used to analyze the Next.js bundle size and compare it with the target branch.

## TODO

* Angular
* React without standalone build