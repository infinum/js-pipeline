# Intro

## TL;DR for publishing a new version

1. Check out the relevant `main` or `release/v<major-version>` branch
2. Run `npm run publish -- v<major-version>.<minor-version>.<patch-version>`

## Branches

* `main` is the main branch and should always have the latest stable version of the action
* `release/v<major-version>` is the release branch for the corresponding major version (except for the latest major version, which is in `main`)
* other branches are feature branches - they should be merged into the release branch once the feature is ready

## Tags

* `v<major-version>.<minor-version>.<patch-version>` is the tag for the corresponding version
* `v<major-version>` is the tag for the latest version of the corresponding major version
* `latest` is the tag for the latest version of the latest major version

## Versioning

* The version should be updated in `package.json`
* The version should be updated in all references to the actions in workflows
* The version should be created in the docusaurus

## Releases

* When a new version is released, it should be tagged and the corresponding release should be created
* The release should contain the changelog for the version
  * The release should contain a list of breaking changes
  * The release should contain a list of change highlights, e.g. new features
  * The full changelog should be generated using the GitHub changelog tool