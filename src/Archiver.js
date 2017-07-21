require("babel-polyfill");

import AdmZip from 'adm-zip';
import zipFolder from 'zip-folder';

class Archiver {
    static extractContentPackage(pathToZip, parentDirectoryToSaveContentsInto) {
        return new Promise((resolve, reject) => {
            console.log(`Unzipping ${pathToZip} content pacakge to ${parentDirectoryToSaveContentsInto} ...`);
            const zip = new AdmZip(pathToZip);
            zip.extractAllTo(parentDirectoryToSaveContentsInto);
            console.log("Unzipping completed.");
            resolve();
        });
    }

    static rezip(directoryToRezip, fullFilePathToSaveNewZipTo) {
        return new Promise((resolve, reject) => {
            console.log(`Rezipping directory contents ${directoryToRezip} to file ${fullFilePathToSaveNewZipTo}...`);
            zipFolder(directoryToRezip, fullFilePathToSaveNewZipTo, (error) => {
                if (error) {
                    console.log("Error while zipping.");
                    reject();
                }
                else {
                    console.log("Rezipped.");
                    resolve();
                }
            });
        });
    }
}

export default Archiver;  