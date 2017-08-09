const AdmZip = require('adm-zip');
const zipFolder = require('zip-folder');

class Archiver {
    extractContentPackage(pathToZip, parentDirectoryToSaveContentsInto) {
        return new Promise((resolve, reject) => {
            console.log(`Unzipping ${pathToZip} content pacakge to ${parentDirectoryToSaveContentsInto} ...`);
            const zip = new AdmZip(pathToZip);
            zip.extractAllTo(parentDirectoryToSaveContentsInto);
            console.log("Unzipping completed.");
            resolve();
        });
    }

    rezip(directoryToRezip, fullFilePathToSaveNewZipTo) {
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

module.exports = Archiver;  