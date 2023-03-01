# Development of JS Pipeline for GitHub Actions

## Custom actions

### Bootstrap

This action is used to install and cache node dependencies for projects.

| property | description | required | default |
| --- | --- | --- | --- |
| `runner` | Runner to use for the action (OS/version). | false | `ubuntu-latest` |
| `package_manager` | Package manager to use for the action. | false | Yarn if `yarn.lock` is present, npm otherwise |
| `node_version` | Node.js version to use. | false | The one defined in `.node-version` |
| `framework` | Framework beeing used (`angular`, `react`, `next`, `node`) | true | N/A |
| `env_vars` | Environment variables to set (in a stringified JSON object). | false | `"{}"` |

### Detect env

This action is used to detect information about the project. The output of this action will be saved to the GitHub Env file and will be available as `env.<property>` in the next steps of the same job.

| property | description | required |
| --- | --- | --- |
| `runner` | Runner to use for the action (OS/version). | false |
| `framework` | Project type - supported values are `angular`, `react`, `next` and `node` | false |
| `ssr` | Whether to build the app in SSR mode. | false |
| `package_manager` | Package manager to use for the action. | false |
| `newrelic` | Should we run server-side newrelic | false |

The logic is as follows:

```bash
  # Framework
  if ${{ inputs.framework != '' }}; then
    framework=${{ inputs.framework }}
  elif [ -f angular.json ]; then
    framework=angular
  elif [ -f next.config.js ]; then
    # This is fine for now since we only support standalone builds and this needs to be set in the next config
    framework=next
  else
    framework=react
  fi

  # SSR
  if ${{ inputs.ssr != '' }}; then
    ssr=${{ inputs.ssr }}
  elif [ -f next.config.js ]; then
    ssr=true
  else
    ssr=false
  fi

  # Package manager
  if ${{ inputs.package_manager != '' }}; then
    package_manager=${{ inputs.package_manager }}
  elif [ -f package-lock.json ]; then
    package_manager=npm
  else
    package_manager=yarn
  fi

  # Tooling
  if ${{ inputs.newrelic != '' }}; then
    newrelic=${{ inputs.newrelic }}
  elif [ -f newrelic.js ]; then
    newrelic=true
  else
    newrelic=false
  fi
```

### Analyze Next.js bundle size (WIP)

This action is used to analyze the Next.js bundle size and compare it with the target branch.

## Next vs React

The reasoning behind why Next.js is a special case of React:

* Next.js gives us some defaults that we can use to simplify the configuration
* Next.js enables us some extra optimizations (e.g. next cache) to speed up the build time
* Next.js has some specific logic around deployment (e.g. preparing the standalone build)

## TODO

* [ ] Angular support <!-- Check if this can be removed -->
* [ ] CSR React/Next support
* [ ] Add Slack notifications for jobs other than deploy
* [ ] Handle situation where SSR is passed as `false`
* [ ] Handle situation where `newrelic` is passed as `false`
* [ ] Add logic for the dist folder selection (should enable Node support)
* [ ] Add support for S3/Cloudfront deployment
* [ ] Add support for Docker deployment
* [ ] Next/React/Node detection based on package.json
* [ ] Standalone build check for next (analyze next.config.js?)
* [ ] Refactor to decrease the size of the main workflow file
