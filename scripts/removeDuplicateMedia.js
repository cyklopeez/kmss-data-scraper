const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// Function to calculate hash for a file
function calculateHash(filePath) {
  const hash = crypto.createHash('sha256');
  const fileBuffer = fs.readFileSync(filePath);
  hash.update(fileBuffer);
  return hash.digest('hex');
}

// Function to delete duplicate files in a directory
function deleteDuplicates(directory) {
  const files = fs.readdirSync(directory);
  const hashes = {};

  files.forEach((file) => {
    const filePath = path.join(directory, file);
    const stats = fs.statSync(filePath);

    if (stats.isDirectory()) {
      // If it's a directory, recursively call deleteDuplicates
      deleteDuplicates(filePath);
    } else if (stats.isFile() && isImageFile(file)) {
      const hash = calculateHash(filePath);

      if (hashes[hash]) {
        // If hash already exists, delete the file
        fs.unlinkSync(filePath);
        console.log(`Deleted duplicate file: ${file}`);
      } else {
        hashes[hash] = true;
      }
    }
  });
}

// Function to check if a file is an image file
function isImageFile(file) {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.ico'];
  return imageExtensions.includes(path.extname(file));
}

// Example usage
const parentDirectory = './media/kmsspbm';
deleteDuplicates(parentDirectory);