const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Path to the text file
const textFilePath = 'D:\\Data\\Emulacao\\Arcadas\\Naomi\\Demul\\romslist_chd.txt';

// Folder to search for files
const folderPath = 'D:\\Data\\Emulacao\\Arcadas\\Mame\\0.262\\MAME 0.262 ROMs (merged)\\';

// Create a readline interface
const rl = readline.createInterface({
  input: fs.createReadStream(textFilePath),
  crlfDelay: Infinity
});

// Read the file line by line
rl.on('line', (line) => {
  // Get the line value
  const lineValue = line.trim() + '.zip';

  /*
  // Check if the line value is a folder
  const fullFolderPath = path.join(folderPath, lineValue);
  fs.stat(fullFolderPath, (err, stats) => {
    if (err) {
      // Folder not found, write line value to file
      fs.appendFile('D:\\Data\\Emulacao\\fullsets\\Naomi 2 GD-ROM\\missing.txt', lineValue + '\n', (err) => {
        if (err) {
          console.error('Error writing to file:', err);
        } else {
          console.log('Line value written to file:', lineValue);
        }
      });
      console.log('Folder not found:', fullFolderPath);
    } else {
      // Folder found, copy the folder and its content to another destination
      const destinationPath = 'D:\\Data\\Emulacao\\fullsets\\Naomi 2 GD-ROM\\';
      const destinationFolderPath = path.join(destinationPath, lineValue);

      fs.mkdir(destinationFolderPath, { recursive: true }, (err) => {
        if (err) {
          console.error('Error creating destination folder:', err);
        } else {
          console.log('Destination folder created:', destinationFolderPath);
          fs.readdir(fullFolderPath, (err, files) => {
            if (err) {
              console.error('Error reading folder:', err);
            } else {
              files.forEach((file) => {
                const sourceFilePath = path.join(fullFolderPath, file);
                const destinationFilePath = path.join(destinationFolderPath, file);

                fs.copyFile(sourceFilePath, destinationFilePath, (err) => {
                  if (err) {
                    console.error('Error copying file:', err);
                  } else {
                    console.log('File copied to:', destinationFilePath);
                  }
                });
              });
            }
          });
        }
      });
      console.log('Folder found:', fullFolderPath);
    }
  });*/

  
  // Search for a file with the line value as the name
  const filePath = path.join(folderPath, lineValue);
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      fs.appendFile('D:\\Data\\Emulacao\\fullsets\\Naomi GD-ROM\\missing.txt', lineValue + '\n', (err) => {
        if (err) {
          console.error('Error writing to file:', err);
        } else {
          console.log('Line value written to file:', lineValue);
        }
      });
      console.log('File not found:', folderPath, lineValue);
    } else {
      // Copy the file to another destination
      const destinationPath = 'D:\\Data\\Emulacao\\fullsets\\Naomi GD-ROM\\';
      const destinationFilePath = path.join(destinationPath, lineValue);

      fs.copyFile(filePath, destinationFilePath, (err) => {
        if (err) {
          console.error('Error copying file:', err);
        } else {
          console.log('File copied to:', destinationFilePath);
        }
      });
      console.log('File found:', folderPath, lineValue);
    }
  });
  
});

// Handle errors
rl.on('error', (err) => {
  console.error('Error reading text file:', err);
});