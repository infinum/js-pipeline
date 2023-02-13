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

Inputs that should be defined in the workflow file are listed bellow. They are not required if you're not using the job that requires them.

| property | description | Relevant jobs | required | default |
| --- | --- | --- | --- | --- |
| `ci_steps` | Steps to run in the workflow, as a space separated string. Possible values are in a separate section above | all | true | N/A |
| `workflow` | Path to the current workflow file | `analyze` | false | N/A |
| `secrets` | Name of the vault to be used | `deploy`, `build` | false | N/A |
| `deploy_host` | Host to deploy to | `deploy` | false | N/A |
| `deploy_user` | User to deploy as | `deploy` | false | N/A |
| `deploy_port` | Port of the deploy server | `deploy` | false | N/A |
| `slack_notification_channel` | Slack channel to send notifications to. | `deploy` | false | N/A |
| `environment` | Environment to deploy to | `deploy` | true | N/A |

Inputs that may be defined in the workflow file, but have defaults that are usually fine:

| property | description | Relevant jobs | required | default |
| --- | --- | --- | --- | --- |
| `runner` | Runner to use for the action (OS/version). | all | false | `ubuntu-latest` |
| `package_manager` | Package manager to use for the action. | all | false | Yarn if `yarn.lock` is present, npm otherwise |
| `node_version` | Node.js version to use. | all | false | The one defined in `.node-version` |
| `framework` | Project type - supported values are `angular`, `react`, `next` and `node` | all | false | `angular` if `angular.json` present in root, `next` if `next.config.js` present in root, otherwise `react` |
| `deploy_to` | Path where the app is deployed on the server | `deploy` | false | `/home/{{deploy_user}}/www/{{deploy_host}}` |
| `dist_path` | Path to build folder | `build, deploy` | false | `./dist/*` |
| `newrelic` | Should we run server-side newrelic | `deploy` | false | `true` if `newrelic.js` exists in project root, `false` otherwise |
| `ssr` | Whether to build the app in SSR mode. | `deploy` | false | `true` if framework is next, `false` otherwise |
| `notify_on` | When to send notifications. Possible values are `success`, `failure` and `all` | `deploy` | false | `all` |
| `project_icon` | Icon to use for the notification | `deploy` | false | JS duck |


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

### Example build config

```yaml
# .github/workflows/pr.yml
name: Build

on:
  pull_request:

jobs:
  test-analyze:
    name: 'Run'
    uses: infinum/js-pipeline/.github/workflows/pipeline.yml@v1
    with:
      ci_steps: 'lint test analyze'
      workflow: '.github/workflows/pr.yml'

```

### Example deploy config

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
    name: 'Deploy'
    uses: infinum/js-pipeline/.github/workflows/pipeline.yml@v1
    with:
      ci_steps: 'deploy'
      secrets: 'js-my-project'
      deploy_host: 'project-name.byinfinum.co'
      deploy_user: 'js-project-name'
      deploy_port: 22
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

## License

The [MIT License](LICENSE)

## Credits

js-pipeline is maintained and sponsored by
[Infinum](https://www.infinum.com).

<p align="center">
  <a href='https://infinum.com'>
    <picture>
        <source srcset="https://assets.infinum.com/brand/logo/static/white.svg" media="(prefers-color-scheme: dark)">
        <img src="https://assets.infinum.com/brand/logo/static/default.svg">
    </picture>
  </a>
</p>
