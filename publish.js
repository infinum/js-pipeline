const execSyncRaw = require('child_process').execSync;
const fs = require('fs');
const args = process.argv.slice(2);

const DEBUG = process.env.DEBUG === 'true';
const DRY_RUN = process.env.DRY_RUN === 'true';

function error(message, ...debug) {
  if (DEBUG) {
    console.error(...debug);
  }
  console.error(`\x1b[31m${message}\x1b[0m`);
  process.exit(1);
}

function execSync(command, write) {
  try {
    if (DRY_RUN && write) {
      console.log(command);
      return '';
    } else {
      return execSyncRaw(command).toString().trim();
    }
  } catch (e) {
    if (DEBUG) {
      console.error(e);
    }
    return '';
  }
}

const LATEST_TAG = 'latest';

const branch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
if (branch !== 'main' && !branch.startsWith('release/') && branch !== 'feature/docusaurus') {
  error('You can only publish from main or release branches.', branch);
}

const version = args[0].match(/v?\d+\.\d+\.\d+/)[0];
if (!version) {
  error('The new version should be set as the first argument.', version);
}

let isLatest = false;
let targetMajor = branch.startsWith('release/') ? branch.split('/')[1] : LATEST_TAG;
const targetLatestTag = execSync(`git rev-list -n 1 ${targetMajor}`).toString().trim();
const latestTagList = execSync(`git tag --points-at ${targetLatestTag}`).toString().trim();

if (targetMajor === LATEST_TAG) {
  // Find the actual major version of the latest tag
  targetMajor = latestTagList.split('\n').find(tag => tag.match(/\d+/))?.split('.')[0];
  isLatest = true;
}
const semver = version.match(/\d+/g).map(Number);

if (semver[0] !== Number(targetMajor.slice(1))) {
  error(`The new version should have the same major version as the latest tag (${targetMajor}).`, semver, targetMajor);
}

const latestMinor = latestTagList.split('\n').find(tag => tag.match(/v\d+.\d+.\d+/));
const latestMinorSemver = latestMinor?.match(/\d+/g).map(Number);

if (latestMinorSemver[1] > semver[1] || (latestMinorSemver[1] === semver[1] && latestMinorSemver[2] >= semver[2])) {
  error(`The new version should be greater than the latest tag (${latestMinor}).`, semver, latestMinorSemver);
}

// TODO
// 1. Update the version in action references
const workflows = fs.readdirSync('./.github/workflows');
workflows.forEach((file) => {
  const content = fs.readFileSync(`./.github/workflows/${file}`).toString();
  const newContent = content.replace(/uses: infinum\/js-pipeline@v\d+.\d+.\d+/g, `uses: infinum/js-pipeline@${version}`);
  fs.writeFileSync(`./.github/workflows/${file}`, newContent);
});
execSync('git add .', true);
execSync(`git commit -m "chore(version): bump action version to ${version}"`, true);

// 2. Create a new docs version in docusaurus
execSync(`npm run docusaurus docs:version ${version}`, true);
execSync('git add .', true);
execSync(`git commit -m "chore(docs): add version ${version}"`, true);

// 3. Update the version in the package.json
const packageJson = require('./package.json');
packageJson.version = version;
fs.writeFileSync('./package.json', JSON.stringify(packageJson, null, 2));
execSync('git add .', true);
execSync(`git commit -m "chore(version): bump package.json version to ${version}"`, true);

// 5. Create a new minor tag
const minorTag = `v${semver[0]}.${semver[1]}.${semver[2]}`;
execSync(`git tag ${minorTag}`, true);

// 6. Update the major tag
execSync(`git tag -f ${targetMajor}`, true);

// 7. Update the latest tag, if needed
if (isLatest) {
  execSync(`git tag -f ${LATEST_TAG}`, true);
}

// 8. Push the changes
execSync(`git push origin ${branch} ${minorTag} ${targetMajor} ${isLatest ? LATEST_TAG : ''}`, true);


console.log(version, semver, latestMinorSemver, branch, targetMajor, latestMinor)