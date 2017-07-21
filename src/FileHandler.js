require("babel-polyfill");

import fs from 'fs-extra';
import xmlReader from 'read-xml';

class FileHandler {
    static readXml(fileToRead) {
        return '<some><xml></xml></some>';
    }

    static writeXml(xmlToWrite) {
        console.log("Writing new XML to file...");

        console.log('XML written.')
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