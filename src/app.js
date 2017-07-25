
require("babel-polyfill");

import Archiver from './Archiver';
import Downloader from './Downloader';
import Corrector from './Corrector';
import FileHandler from './FileHandler';

console.log("Starting...");

async function start() {
    // Will come from CSV once looped
    const urlToDownloadFrom = 'https://study.ashworthcollege.edu/samigo-app/servlet/DownloadCP?&assessmentId=106635';
    const pathToSaveZipTo = 'c:\\Users\\mike\\Downloads\\downloaded.zip';
    const folderWithUnzippedContent = 'c:\\Users\\mike\\Downloads\\unzipped';
    const xmlFilePath = `${folderWithUnzippedContent}\\exportAssessment.xml`;

    //await Downloader.downloadPackage(urlToDownloadFrom, pathToSaveZipTo);
    await Archiver.extractContentPackage(pathToSaveZipTo, folderWithUnzippedContent);

    const rawXml = await FileHandler.readQtiXml(xmlFilePath);
    const correctAnswerXml = await Corrector.selectCorrectAnswer(rawXml);
    const removedClassXml = await Corrector.removeClassAttributes(correctAnswerXml);
   
    let droppedNodes = "";
    await Corrector.dropNodes(removedClassXml, 'qticomment')
        .then((xml) => Corrector.dropNodes(xml, 'qtimetadata'))
        .then((xml) => Corrector.dropNodes(xml, 'assessmentcontrol'))
        .then((xml) => Corrector.dropNodes(xml, 'rubric'))
        .then((xml) => Corrector.dropNodes(xml, 'duration'))
        .then((xml) => droppedNodes = xml);

    const formattedXml = await Corrector.fixWhitespace(droppedNodes);
 
    await FileHandler.writeXml(formattedXml, xmlFilePath); 

    await Archiver.rezip(folderWithUnzippedContent, 'c:\\Users\\mike\\Downloads\\rezipped.zip');
 
    //await FileHandler.deleteUnzipDirectory(folderWithUnzippedContent);
}

start();