const { spawn } = require('child_process');
const http = require('http');

// Compile SCSS first
console.log('📦 Compilând SCSS...');
const compileSass = spawn('npm', ['run', 'compile:sass'], { stdio: 'inherit' });

compileSass.on('close', (code) => {
  if (code !== 0) {
    console.error('❌ Eroare la compilarea SCSS');
    process.exit(1);
  }

  console.log('✅ SCSS compilat cu succes');
  console.log('🚀 Pornind serverul local...');

  // Start live-server
  const liveServer = spawn('npx', ['live-server', './src', '--port=8080', '--no-browser'], {
    stdio: 'pipe'
  });

  liveServer.stderr.on('data', (data) => {
    const output = data.toString();
    if (output.includes('Serving')) {
      console.log('✅ Serverul local este activ pe http://localhost:8080');
      
      // Wait a bit more to ensure server is ready
      setTimeout(() => {
        console.log('🌐 Pornind ngrok...');
        console.log('📋 URL-ul public va apărea mai jos:\n');
        
        // Start ngrok
        const ngrok = spawn('npx', ['ngrok', 'http', '8080'], {
          stdio: 'inherit'
        });

        ngrok.on('close', () => {
          console.log('\n🛑 Oprire server...');
          liveServer.kill();
          process.exit(0);
        });
      }, 3000);
    }
  });

  // Handle cleanup
  process.on('SIGINT', () => {
    console.log('\n🛑 Oprire...');
    liveServer.kill();
    process.exit(0);
  });
});
