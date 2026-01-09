const fs = require('fs');
const path = require('path');

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
copyDir('src', 'public');
console.log('Files copied from src to public');
