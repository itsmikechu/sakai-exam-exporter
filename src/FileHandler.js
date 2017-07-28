require("babel-polyfill");

import fs from 'fs-extra';

class FileHandler {
    readXml(fileToRead) {
        return new Promise((resolve, reject) => {
            console.log(`Reading xml file ${fileToRead} ...`);

            resolve(fs.readFileSync(fileToRead, 'utf8'));
        });
    }
 
    writeXml(xmlToWrite, filePath) {
        return fs.writeFile(filePath, xmlToWrite);
    }

    deleteDirectory(directoryPath) {
        console.log("Deleting directory...");
        return fs.remove(directoryPath)
            .then(() => {
                console.log('Deleted folder.');
            });
    }

    deleteFile(filePath) {
        return fs.remove(filePath);
    }
}

export default FileHandler;