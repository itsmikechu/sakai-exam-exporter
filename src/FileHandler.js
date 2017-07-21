require("babel-polyfill");

import fs from 'fs-extra';

class FileHandler {
    static readQtiXml(fileToRead) {
        return new Promise((resolve, reject) => {
            console.log(`Reading xml file ${fileToRead} ...`);

            resolve(fs.readFileSync(fileToRead, 'utf8'));
        });
    }

    static writeXml(xmlToWrite, filePath) {
        return fs.writeFile(filePath, xmlToWrite);
    }

    static deleteUnzipDirectory(directoryPath) {
        console.log("Deleting temporary unzip directory...");
        return fs.remove(directoryPath)
            .then(() => {
                console.log('Deleted unzip folder.');
            });
    }
}

export default FileHandler;