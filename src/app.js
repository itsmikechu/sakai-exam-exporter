
require("babel-polyfill");

import Archiver from './Archiver';
import Downloader from './Downloader';
import Corrector from './Corrector';
import FileHandler from './FileHandler';

console.log("Starting.");

async function start() {
    const urlToDownloadFrom = 'https://study.ashworthcollege.edu/samigo-app/servlet/DownloadCP?&assessmentId=106635';
    const pathToSaveZipTo = 'c:\\Users\\mike\\Downloads\\downloaded.zip';
    const folderWithUnzippedContent = 'c:\\Users\\mike\\Downloads\\unzipped';
    const xmlFilePath = `${folderWithUnzippedContent}\\exportAssessment.xml`;

    await Downloader.downloadPackage(urlToDownloadFrom, pathToSaveZipTo);
    await Archiver.extractContentPackage(pathToSaveZipTo, folderWithUnzippedContent);

    // const readyXml = Corrector.fixWhitespace(Corrector.fixFlowTag(FileHandler.readXml(xmlFilePath)));

    // console.log(readyXml);

    // FileHandler.writeXml(readyXml);

    await Archiver.rezip(folderWithUnzippedContent, 'c:\\Users\\mike\\Downloads\\rezipped.zip');

    await FileHandler.deleteUnzipDirectory(folderWithUnzippedContent);
}

start();