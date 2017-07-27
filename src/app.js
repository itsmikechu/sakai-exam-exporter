require("babel-polyfill");

import Archiver from './Archiver';
import Downloader from './Downloader';
import QtiCorrector from './QtiCorrector';
import ManifestCorrector from './ManifestCorrector';
import FileHandler from './FileHandler';

console.log("Starting...");

async function start(assessmentId, guid) {
    const urlToDownloadFrom = `https://study.ashworthcollege.edu/samigo-app/servlet/DownloadCP?&assessmentId=${assessmentId}`;
    const pathToSaveZipTo = `c:\\Users\\mike\\Downloads\\${guid}\\${assessmentId}.zip`;
    const folderWithUnzippedContent = 'c:\\Users\\mike\\Downloads\\unzipped';
    const qtiXmlFile = `${folderWithUnzippedContent}\\exportAssessment.xml`;
    const manifestXmlFile = `${folderWithUnzippedContent}\\imsmanifest.xml`;

    await Downloader.downloadPackage(urlToDownloadFrom, pathToSaveZipTo);
    await Archiver.extractContentPackage(pathToSaveZipTo, folderWithUnzippedContent);

    let qtiXml = "";
    await FileHandler.readXml(qtiXmlFile)
        .then((xml) => QtiCorrector.selectCorrectAnswer(xml))
        .then((xml) => QtiCorrector.removeClassAttributes(xml))
        .then((xml) => QtiCorrector.addXmlDeclaration(xml))
        .then((xml) => QtiCorrector.dropNodes(xml, 'qticomment'))
        .then((xml) => QtiCorrector.dropNodes(xml, 'qtimetadata'))
        .then((xml) => QtiCorrector.dropNodes(xml, 'assessmentcontrol'))
        .then((xml) => QtiCorrector.dropNodes(xml, 'rubric'))
        .then((xml) => QtiCorrector.dropNodes(xml, 'duration'))
        .then((xml) => QtiCorrector.dropNodes(xml, 'presentation_material'))
        .then((xml) => QtiCorrector.dropNodes(xml, 'assessfeedback'))
        .then((xml) => QtiCorrector.dropNodes(xml, 'selection_ordering'))
        .then((xml) => QtiCorrector.dropNodes(xml, 'itemmetadata'))
        .then((xml) => QtiCorrector.removeEmptyAnswers(xml))
        .then((xml) => QtiCorrector.unwrapContent(xml, 'flow'))
        .then((xml) => QtiCorrector.fixWhitespace(xml))
        .then((xml) => qtiXml = xml);

    const examTitle = (await QtiCorrector.getExamTitle(qtiXml)).replace(',', '');

    let manifestXml = "";
    await FileHandler.readXml(manifestXmlFile)
        .then((xml) => ManifestCorrector.addSchemaTag(xml))
        .then((xml) => ManifestCorrector.addSchemaVersionTag(xml))
        .then((xml) => ManifestCorrector.setTitle(xml, examTitle))
        .then((xml) => ManifestCorrector.fixWhitespace(xml))
        .then((xml) => manifestXml = xml);

    await FileHandler.writeXml(qtiXml, `${folderWithUnzippedContent}\\${examTitle}.xml`);
    await FileHandler.deleteFile(qtiXmlFile);
    await FileHandler.writeXml(manifestXml, manifestXmlFile);

    await Archiver.rezip(folderWithUnzippedContent, `c:\\Users\\mike\\Downloads\\${examTitle}.zip`);

    await FileHandler.deleteUnzipDirectory(folderWithUnzippedContent);
}

start(106635, 'b7d1a71a-f4c2-42d1-9642-dcea4c03622b');
// start(106636, 'b7d1a71a-f4c2-42d1-9642-dcea4c03622b');
// start(106638, 'b7d1a71a-f4c2-42d1-9642-dcea4c03622b');
// start(106639, 'b7d1a71a-f4c2-42d1-9642-dcea4c03622b');
// start(106640, 'b7d1a71a-f4c2-42d1-9642-dcea4c03622b');
// start(106641, 'b7d1a71a-f4c2-42d1-9642-dcea4c03622b');
