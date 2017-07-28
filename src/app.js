require("babel-polyfill");

import Archiver from './Archiver';
import Downloader from './Downloader';
import QtiCorrector from './QtiCorrector';
import ManifestCorrector from './ManifestCorrector';
import FileHandler from './FileHandler';

class App {
    async process(assessmentId, guid) {
        console.log(`Starting to process ${assessmentId} in Sakai course ${guid}...`);
        const baseFolder = 'c:\\Users\\mike\\Downloads';
        const urlToDownloadFrom = `https://study.ashworthcollege.edu/samigo-app/servlet/DownloadCP?&assessmentId=${assessmentId}`;
        const pathToSaveZipTo = `${baseFolder}\\${guid}\\Sakai-${assessmentId}.zip`;
        const pathToUnzipTo = `${baseFolder}\\${guid}\\${assessmentId}`;
        const qtiXmlFile = `${pathToUnzipTo}\\exportAssessment.xml`;
        const manifestXmlFile = `${pathToUnzipTo}\\imsmanifest.xml`;

        const fileHandler = new FileHandler();

        await (new Downloader()).downloadPackage(urlToDownloadFrom, pathToSaveZipTo);
        
        const archiver = new Archiver();
        await archiver.extractContentPackage(pathToSaveZipTo, pathToUnzipTo);

        const qtiCorrector = new QtiCorrector();

        let qtiXml = "";
        await fileHandler.readXml(qtiXmlFile)
            .then((xml) => qtiCorrector.selectCorrectAnswer(xml))
            .then((xml) => qtiCorrector.removeClassAttributes(xml))
            .then((xml) => qtiCorrector.addXmlDeclaration(xml))
            .then((xml) => qtiCorrector.dropNodes(xml, 'qticomment'))
            .then((xml) => qtiCorrector.dropNodes(xml, 'qtimetadata'))
            .then((xml) => qtiCorrector.dropNodes(xml, 'assessmentcontrol'))
            .then((xml) => qtiCorrector.dropNodes(xml, 'rubric'))
            .then((xml) => qtiCorrector.dropNodes(xml, 'duration'))
            .then((xml) => qtiCorrector.dropNodes(xml, 'presentation_material'))
            .then((xml) => qtiCorrector.dropNodes(xml, 'assessfeedback'))
            .then((xml) => qtiCorrector.dropNodes(xml, 'selection_ordering'))
            .then((xml) => qtiCorrector.dropNodes(xml, 'itemmetadata'))
            .then((xml) => qtiCorrector.removeEmptyAnswers(xml))
            .then((xml) => qtiCorrector.unwrapContent(xml, 'flow'))
            .then((xml) => qtiCorrector.fixWhitespace(xml))
            .then((xml) => qtiXml = xml);

        const examTitle = (await qtiCorrector.getExamTitle(qtiXml)).replace(',', '');

        const mainifestCorrector = new ManifestCorrector();

        let manifestXml = "";
        await fileHandler.readXml(manifestXmlFile)
            .then((xml) => mainifestCorrector.addSchemaTag(xml))
            .then((xml) => mainifestCorrector.addSchemaVersionTag(xml))
            .then((xml) => mainifestCorrector.setTitle(xml, examTitle))
            .then((xml) => mainifestCorrector.fixWhitespace(xml))
            .then((xml) => manifestXml = xml);

        await fileHandler.writeXml(qtiXml, `${pathToUnzipTo}\\${examTitle}.xml`);
        await fileHandler.deleteFile(qtiXmlFile);
        await fileHandler.writeXml(manifestXml, manifestXmlFile);

        const outputFile = `${baseFolder}\\${guid}\\Brightspace-${examTitle}.zip`;
        await archiver.rezip(pathToUnzipTo, outputFile);

        await fileHandler.deleteDirectory(pathToUnzipTo);

        console.log(`Completed processing ${assessmentId}. Files saved to ${outputFile}`);
    }

    static async main() {
        console.time('main');

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
                id: 106637,
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
            await (new App()).process(exam.id, exam.guid);
        }

        console.log('Done with batch:', console.timeEnd('main'));
    }
}

App.main();