const fs = require('fs');
const path = require('path');

// Define the base directories
const baseDirs = ['media/kmssmitochondria'];

// Function to rename media files in a given directory
const renameMediaFiles = (dir) => {
  fs.readdir(dir, (err, folders) => {
    if (err) {
      console.error(`Error reading directory ${dir}:`, err);
      return;
    }

    folders.forEach((folder) => {
      const folderPath = path.join(dir, folder);

      fs.readdir(folderPath, (err, files) => {
        if (err) {
          console.error(`Error reading folder ${folderPath}:`, err);
          return;
        }

        files.forEach((file, index) => {
          const oldFilePath = path.join(folderPath, file);
          const newFileName = `media-${index + 1}.jpg`;
          const newFilePath = path.join(folderPath, newFileName);

          if (oldFilePath.includes('metadata')) {
            return;
          }

          fs.rename(oldFilePath, newFilePath, (err) => {
            if (err) {
              console.error(`Error renaming file ${oldFilePath} to ${newFilePath}:`, err);
            } else {
              console.log(`Renamed ${oldFilePath} to ${newFilePath}`);
            }
          });
        });
      });
    });
  });
};

// Process each base directory
baseDirs.forEach((baseDir) => {
  renameMediaFiles(baseDir);
});