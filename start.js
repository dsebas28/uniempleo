const { spawn, exec } = require('child_process');
const path = require('path');

console.log('\x1b[36m%s\x1b[0m', '======================================================');
console.log('\x1b[33m%s\x1b[0m', '          INICIANDO PLATAFORMA UNIEMPLEO              ');
console.log('\x1b[36m%s\x1b[0m', '======================================================\n');

const isWindows = process.platform === 'win32';
const npmCmd = isWindows ? 'npm.cmd' : 'npm';

// 1. Start Backend
console.log('\x1b[32m%s\x1b[0m', '🚀 [1/3] Levantando Servidor Backend (puerto 5000)...');
const backend = spawn(npmCmd, ['run', 'dev'], {
  cwd: path.join(__dirname, 'backend'),
  shell: true,
  stdio: 'inherit'
});

// 2. Start Frontend
console.log('\x1b[32m%s\x1b[0m', '💻 [2/3] Levantando Frontend Web (puerto 5173)...');
const frontend = spawn(npmCmd, ['run', 'dev'], {
  cwd: path.join(__dirname, 'frontend'),
  shell: true,
  stdio: 'inherit'
});

// 3. Open browser after short delay
setTimeout(() => {
  console.log('\x1b[35m%s\x1b[0m', '\n🌐 [3/3] Abriendo navegador en http://localhost:5173 ...\n');
  const openCmd = isWindows ? 'start http://localhost:5173' : 'open http://localhost:5173';
  exec(openCmd, (err) => {
    if (err) console.log('Abre en tu navegador: http://localhost:5173');
  });
}, 3500);

function shutdown() {
  console.log('\n\x1b[31m%s\x1b[0m', 'Deteniendo servidores de UniEmpleo...');
  try {
    backend.kill();
    frontend.kill();
  } catch (e) {}
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
