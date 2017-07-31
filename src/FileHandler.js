require("babel-polyfill");

import fs from 'fs-extra';
import csv from 'csvtojson';

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

export default FileHandler;