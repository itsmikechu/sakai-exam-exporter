import AdmZip from 'adm-zip';
import ZipFolder from 'zip-folder';

class Zip {
    static unzip(pathToZip, parentDirectoryToSaveContentsInto) {
        console.log(`Unzipping contents of ${pathToZip} to ${parentDirectoryToSaveContentsInto}.`);

        const zipFile = new AdmZip(pathToZip);
        zipFile.extractAllTo(parentDirectoryToSaveContentsInto);

        console.log("Unzip completed.");
    }

    static rezip(directoryToRezip, fullFilePathToSaveNewZipTo) {
        console.log(`Rezipping directory contents ${directoryToRezip} to file ${fullFilePathToSaveNewZipTo}.`);

        ZipFolder(directoryToRezip, fullFilePathToSaveNewZipTo, () => {
            console.log("Rezip completed.");
        });

    }
}

export default Zip;  