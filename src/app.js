import Archiver from './Archiver';
import Downloader from './Downloader';
import Corrector from './Corrector';
import fs from 'fs';
import xmlReader from 'read-xml';

console.log("Starting.");

function start() { 
    const urlToDownloadFrom = 'https://study.ashworthcollege.edu/samigo-app/servlet/DownloadCP?&assessmentId=106635';
    const pathToSaveZipTo = 'c:\\Users\\mike\\Downloads\\downloaded.zip';
    const folderWithUnzippedContent = 'c:\\Users\\mike\\Downloads\\unzipped';
    const xmlFilePath = `${folderWithUnzippedContent}\\exportAssessment.xml`;

    Downloader.downloadPackage(urlToDownloadFrom, pathToSaveZipTo);
    Archiver.unzip(pathToSaveZipTo, folderWithUnzippedContent);

    fs.read
    Corrector.fixFlowTag(xmlFilePath);
    Corrector.fixWhitespace()

    Archiver.rezip(folderWithUnzippedContent, 'c:\\Users\\mike\\Downloads\\rezipped.zip');
}

start();