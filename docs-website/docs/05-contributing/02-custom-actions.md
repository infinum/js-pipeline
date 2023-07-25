

# Custom actions

## Bootstrap

This action is used to install and cache node dependencies for projects.

| property | description | required | default |
| --- | --- | --- | --- |
| `runner` | Runner to use for the action (OS/version). | No | `ubuntu-latest` |
| `package_manager` | Package manager to use for the action. | No | Yarn if `yarn.lock` is present, npm otherwise |
| `node_version` | Node.js version to use. | No | The one defined in `.node-version` |
| `framework` | Framework beeing used (`angular`, `react`, `next`, `node`) | **Yes** | N/A |
| `env_vars` | Environment variables to set (in a stringified JSON object). | No | `"{}"` |

## Detect env

This action is used to detect information about the project. The output of this action will be saved to the GitHub Env file and will be available as `env.<property>` in the next steps of the same job.

| property | description | required |
| --- | --- | --- |
| `runner` | Runner to use for the action (OS/version). | No |
| `framework` | Project type - supported values are `angular`, `react`, `next` and `node` | No |
| `ssr` | Whether to build the app in SSR mode. | No |
| `package_manager` | Package manager to use for the action. | No |
| `newrelic` | Should we run server-side newrelic | No |

The logic is as follows:

```js
  // Framework
  if (inputs.framework) {
    framework = inputs.framework;
  } else if (fs.existsSync('angular.json')) {
    framework = 'angular';
  } else if (fs.existsSync('next.config.js')) {
    framework = 'next';
  } else {
    framework = 'react';
  }
  
  // SSR
  ssr = inputs.ssr ?? fs.existsSync('next.config.js');
  
  // Package manager
  if (inputs.package_manager) {
    package_manager = inputs.package_manager;
  } else {
    package_manager = fs.existsSync('package-lock.json') ? 'npm' : 'yarn';
  }
  
  // Tooling
  newrelic = inputs.newrelic ?? fs.existsSync('newrelic.js');
```

## Analyze Next.js bundle size (WIP)

This action is used to analyze the Next.js bundle size and compare it with the target branch.