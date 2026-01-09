const fs = require('fs');
const path = require('path');

// Ensure public directory exists and is clean
const publicDir = 'public';
if (fs.existsSync(publicDir)) {
  fs.rmSync(publicDir, { recursive: true, force: true });
}
fs.mkdirSync(publicDir, { recursive: true });

function copyDir(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    // Skip scss directory and scss files
    if (entry.isDirectory() && entry.name === 'scss') {
      continue;
    }

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else if (entry.isFile() && !entry.name.endsWith('.scss')) {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Copy src to public
if (!fs.existsSync('src')) {
  console.error('Error: src directory does not exist');
  process.exit(1);
}

copyDir('src', 'public');

// Verify public directory was created and has files
if (!fs.existsSync('public')) {
  console.error('Error: public directory was not created');
  process.exit(1);
}

if (!fs.existsSync('public/index.html')) {
  console.error('Error: public/index.html was not created');
  process.exit(1);
}

// List contents for debugging
const publicContents = fs.readdirSync('public');
console.log('✓ Files copied from src to public');
console.log('✓ Public directory contents:', publicContents.join(', '));
console.log('✓ Build completed successfully');
console.log('✓ Public directory path:', path.resolve('public'));
