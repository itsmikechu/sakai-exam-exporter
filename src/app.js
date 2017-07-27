
require("babel-polyfill");

import Archiver from './Archiver';
import Downloader from './Downloader';
import QtiCorrector from './QtiCorrector';
import ManifestCorrector from './ManifestCorrector';
import FileHandler from './FileHandler';

console.log("Starting..."); 

async function start() {
    // Will come from CSV once looped
    const urlToDownloadFrom = 'https://study.ashworthcollege.edu/samigo-app/servlet/DownloadCP?&assessmentId=106635';
    const pathToSaveZipTo = 'c:\\Users\\mike\\Downloads\\downloaded.zip';
    const folderWithUnzippedContent = 'c:\\Users\\mike\\Downloads\\unzipped';
    const qtiXmlFile = `${folderWithUnzippedContent}\\exportAssessment.xml`;
    const manifestXmlFile = `${folderWithUnzippedContent}\\imsmanifest.xml`;

    //await Downloader.downloadPackage(urlToDownloadFrom, pathToSaveZipTo);
    await Archiver.extractContentPackage(pathToSaveZipTo, folderWithUnzippedContent);

    let qtiXml = "";
    await FileHandler.readXml(qtiXmlFile)
        .then((xml) => QtiCorrector.selectCorrectAnswer(xml))
        .then((xml) => QtiCorrector.removeClassAttributes(xml))
        .then((xml) => QtiCorrector.dropNodes(xml, 'qticomment'))
        .then((xml) => QtiCorrector.addXmlDeclaration(xml))
        .then((xml) => QtiCorrector.dropNodes(xml, 'qtimetadata'))
        .then((xml) => QtiCorrector.dropNodes(xml, 'assessmentcontrol'))
        .then((xml) => QtiCorrector.dropNodes(xml, 'rubric'))
        .then((xml) => QtiCorrector.dropNodes(xml, 'duration'))
        .then((xml) => QtiCorrector.dropNodes(xml, 'presentation_material'))
        .then((xml) => QtiCorrector.dropNodes(xml, 'assessfeedback')) 
        .then((xml) => QtiCorrector.dropNodes(xml, 'selection_ordering'))
        .then((xml) => QtiCorrector.dropNodes(xml, 'itemmetadata'))
        .then((xml) => QtiCorrector.fixWhitespace(xml))
        .then((xml) => qtiXml = xml);

    let manifestXml = "";
    await FileHandler.readXml(manifestXmlFile)
        .then((xml) => ManifestCorrector.addSchemaTag(xml))
        .then((xml) => ManifestCorrector.addSchemaVersionTag(xml))
        .then((xml) => ManifestCorrector.fixWhitespace(xml))
        .then((xml) => manifestXml = xml);
 
    await FileHandler.writeXml(qtiXml, qtiXmlFile);
    await FileHandler.writeXml(manifestXml, manifestXmlFile);

    await Archiver.rezip(folderWithUnzippedContent, 'c:\\Users\\mike\\Downloads\\rezipped.zip');
 
    //await FileHandler.deleteUnzipDirectory(folderWithUnzippedContent);
}

start();