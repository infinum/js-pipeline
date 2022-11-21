# Development of JS Pipeline for GitHub Actions

## Custom actions

### Bootstrap Next.js

This action is used to install and cache node dependencies specifically for Next.js projects.

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