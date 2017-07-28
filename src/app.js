require("babel-polyfill");

import Archiver from './Archiver';
import Downloader from './Downloader';
import QtiCorrector from './QtiCorrector';
import ManifestCorrector from './ManifestCorrector';
import FileHandler from './FileHandler';

class App {
    static async process(assessmentId, guid) {
        console.log(`Starting to process ${assessmentId} in Sakai course ${guid}...`);
        const baseFolder = 'c:\\Users\\mike\\Downloads';
        const urlToDownloadFrom = `https://study.ashworthcollege.edu/samigo-app/servlet/DownloadCP?&assessmentId=${assessmentId}`;
        const pathToSaveZipTo = `${baseFolder}\\${guid}\\Sakai-${assessmentId}.zip`;
        const pathToUnzipTo = `${baseFolder}\\${guid}\\${assessmentId}`;
        const qtiXmlFile = `${pathToUnzipTo}\\exportAssessment.xml`;
        const manifestXmlFile = `${pathToUnzipTo}\\imsmanifest.xml`;

        await Downloader.downloadPackage(urlToDownloadFrom, pathToSaveZipTo);
        await Archiver.extractContentPackage(pathToSaveZipTo, pathToUnzipTo);

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

        await FileHandler.writeXml(qtiXml, `${pathToUnzipTo}\\${examTitle}.xml`);
        await FileHandler.deleteFile(qtiXmlFile);
        await FileHandler.writeXml(manifestXml, manifestXmlFile);

        const outputFile = `${baseFolder}\\${guid}\\Brightspace-${examTitle}.zip`;
        await Archiver.rezip(pathToUnzipTo, outputFile);

        await FileHandler.deleteUnzipDirectory(pathToUnzipTo);

        console.log(`Completed processing ${assessmentId}. Files saved to ${outputFile}`);
    }

    static async start() {
        const exams = [
            {
                id: 106635,
                guid: 'b7d1a71a-f4c2-42d1-9642-dcea4c03622b',
            },
            {
                id: 106636,
                guid: 'b7d1a71a-f4c2-42d1-9642-dcea4c03622b',
            },
            {
                id: 106638,
                guid: 'b7d1a71a-f4c2-42d1-9642-dcea4c03622b',
            },
            {
                id: 106639,
                guid: 'b7d1a71a-f4c2-42d1-9642-dcea4c03622b',
            },
            {
                id: 106640,
                guid: 'b7d1a71a-f4c2-42d1-9642-dcea4c03622b',
            },
            {
                id: 106641,
                guid: 'b7d1a71a-f4c2-42d1-9642-dcea4c03622b',
            },
        ];

        for (let exam of exams) {
            await App.process(exam.id, exam.guid);
        }

        console.log('Done with batch.');
    }
}

App.start()