const { spawn } = require('child_process');

const device = process.argv[2] || 'android';
const environment = process.argv[3] || 'development';

const run = device === 'ios' ? 'run-ios' : 'run-android';

const child = spawn(
  process.platform === 'win32' ? 'npx.cmd' : 'npx',
  ['react-native', run],
  {
    stdio: 'inherit',
    env: {
      ...process.env,
      APP_ENV: environment,
    },
    shell: true,
  }
);

child.on('exit', code => {
  process.exit(code ?? 0);
});
