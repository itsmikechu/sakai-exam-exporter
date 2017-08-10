const Archiver = require('./Archiver');
const Downloader = require('./Downloader');
const QtiCorrector = require('./QtiCorrector');
const ManifestCorrector = require('./ManifestCorrector');
const FileHandler = require('./FileHandler');
const config = require('./config.json');

class App {
    async process(examInfo) {
        console.log(`Starting to process ${examInfo.sakaiAssessmentId} in Sakai course ${examInfo.sakaiGuid}...`);
        const urlToDownloadFrom = `https://study.ashworthcollege.edu/samigo-app/servlet/DownloadCP?&assessmentId=${examInfo.sakaiAssessmentId}`;
        const pathToSaveZipTo = `${config.workingFolder}\\${examInfo.sakaiGuid}\\Sakai-${examInfo.sakaiAssessmentId}.zip`;
        const pathToUnzipTo = `${config.workingFolder}\\${examInfo.sakaiGuid}\\${examInfo.sakaiAssessmentId}`;
        const qtiXmlFile = `${pathToUnzipTo}\\exportAssessment.xml`;
        const manifestXmlFile = `${pathToUnzipTo}\\imsmanifest.xml`;

        await (new Downloader()).downloadPackage(urlToDownloadFrom, pathToSaveZipTo);

        const archiver = new Archiver();
        await archiver.extractContentPackage(pathToSaveZipTo, pathToUnzipTo);

        const qtiCorrector = new QtiCorrector();

        const fileHandler = new FileHandler();
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

        const examTitle = (await qtiCorrector.getExamTitle(qtiXml)).replace(',', '').replace('/', '-').replace('\\', '-').replace(new RegExp(':', 'g'), '-').replace(new RegExp('&', 'g'), '');

        const mainifestCorrector = new ManifestCorrector();

        let manifestXml = "";
        await fileHandler.readXml(manifestXmlFile)
            .then((xml) => mainifestCorrector.addSchemaTag(xml))
            .then((xml) => mainifestCorrector.addSchemaVersionTag(xml))
            .then((xml) => mainifestCorrector.setTitle(xml, examTitle))
            .then((xml) => mainifestCorrector.fixWhitespace(xml))
            .then((xml) => manifestXml = xml);

        console.log(`New exam title ${examTitle}`);
        await fileHandler.writeStringToPath(qtiXml, `${pathToUnzipTo}\\${examTitle}.xml`);
        await fileHandler.deleteFile(qtiXmlFile);
        await fileHandler.writeStringToPath(manifestXml, manifestXmlFile);

        const outputFile = `${config.workingFolder}\\${examInfo.sakaiGuid}\\Brightspace-${examTitle}.zip`;
        await archiver.rezip(pathToUnzipTo, outputFile);

        await fileHandler.deleteDirectory(pathToUnzipTo);

        console.log(`Completed processing ${examInfo.sakaiAssessmentId}. Files saved to ${outputFile}`);
        return outputFile;
    }

    static async main() {
        console.time('main');

        const fileHandler = new FileHandler();
        const exams = await fileHandler.readCsv(`${config.workingFolder}\\quizzes.csv`);

        // https://stackoverflow.com/questions/8847766/how-to-convert-json-to-csv-format-and-store-in-a-variable
        const fields = Object.keys(exams[0])
        const replacer = (key, value) => { return value === null ? '' : value }
        const outputCsvFile = `${config.workingFolder}\\quizzes-output.csv`;

        const header = fields.join(',');
        if (!header.includes('zipPath')) {
            throw "Input quizzes.csv files does not have a column called 'zipPath'. Please add it.";
        }

        await fileHandler.appendStringToPath(`${header}\r\n`, outputCsvFile);

        for (let exam of exams) {
            exam.zipPath = await (new App()).process(exam);

            const csv = fields.map((fieldName) => {
                return JSON.stringify(exam[fieldName], replacer)
            }).join(',');

            await fileHandler.appendStringToPath(`${csv}\r\n`, outputCsvFile);
        }

        console.log('Done with batch.');
        console.timeEnd('main');
    }
}

App.main();