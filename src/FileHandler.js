const fs = require('fs-extra');
const csv = require('csvtojson');

class FileHandler {
    readXml(fileToRead) {
        return new Promise((resolve, reject) => {
            console.log(`Reading xml file ${fileToRead} ...`);

            resolve(fs.readFileSync(fileToRead, 'utf8'));
        });
    }

    writeStringToPath(dataString, filePath) {
        return fs.writeFile(filePath, dataString);
    }

    appendStringToPath(dataString, filePath) {
        return fs.appendFile(filePath, dataString);
    }

    readCsv(csvFilePath) {
        console.log('Reading CSV file...');

        return new Promise((resolve, reject) => {
            const exams = [];
            csv()
                .fromFile(csvFilePath)
                .on('json', (exam) => {
                    exams.push(exam);
                })
                .on('done', (error) => {
                    if (error) {
                        console.log(error);
                        reject(error);
                    }
                    else {
                        console.log('File read.');
                        resolve(exams);
                    }
                });
        });
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

module.exports = FileHandler;