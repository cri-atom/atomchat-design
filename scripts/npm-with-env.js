const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const { loadDotEnv } = require('./load-dotenv');

const root = path.resolve(__dirname, '..');
const authNpmrcPath = path.join(root, '.npmrc.auth');
const env = loadDotEnv();
const npmArgs = process.argv.slice(2);

if (!npmArgs.length) {
  npmArgs.push('install');
}

const token = env.FONTAWESOME_NPM_AUTH_TOKEN?.trim();
if (!token) {
  console.error(
    '[npm-with-env] FONTAWESOME_NPM_AUTH_TOKEN no está definido.\n' +
      '  1. cp .env.example .env\n' +
      '  2. Pega tu Package Manager Token de https://fontawesome.com/account/general\n' +
      '  3. npm run install:deps',
  );
  process.exit(1);
}

fs.writeFileSync(
  authNpmrcPath,
  [
    '@fortawesome:registry=https://npm.fontawesome.com/',
    `//npm.fontawesome.com/:_authToken=${token}`,
    '',
  ].join('\n'),
  'utf8',
);

const result = spawnSync(
  'npm',
  ['--userconfig', authNpmrcPath, ...npmArgs],
  {
    stdio: 'inherit',
    env,
    shell: true,
    cwd: root,
  },
);

if (result.status === 0) {
  spawnSync('node', [path.join(__dirname, 'generate-fa-icon-types.js')], {
    stdio: 'inherit',
    cwd: root,
  });
}

process.exit(result.status ?? 1);
