const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const { loadDotEnv } = require('./load-dotenv');

const root = path.resolve(__dirname, '..');
const authNpmrcPath = path.join(root, '.npmrc.auth');
const env = loadDotEnv();
const token = env.FONTAWESOME_NPM_AUTH_TOKEN?.trim();

if (!token) {
  console.error('[verify-fa-auth] FONTAWESOME_NPM_AUTH_TOKEN no definido en .env');
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
  ['--userconfig', authNpmrcPath, 'view', '@fortawesome/fontawesome-pro', 'version'],
  { encoding: 'utf8', env, cwd: root },
);

if (result.status !== 0) {
  console.error('[verify-fa-auth] Falló la autenticación con npm.fontawesome.com');
  console.error(result.stderr || result.stdout);
  process.exit(1);
}

console.log('[verify-fa-auth] OK — fontawesome-pro', result.stdout.trim());
