import Archiver from './Archiver';
import Downloader from './Downloader';
import Corrector from './Corrector';

console.log("Starting.");

function start() { 
    Archiver.unzip('c:\\Users\\mike\\Downloads\\Original.zip', 'c:\\Users\\mike\\Downloads\\unzipped\\');
    Downloader.downloadPackage('https://study.ashworthcollege.edu/samigo-app/servlet/DownloadCP?&assessmentId=106635');
    Corrector.fixFlowTag('c:\\Users\\mike\\Downloads\\unzipped\\exportAssessment.xml');
    Archiver.rezip('c:\\Users\\mike\\Downloads\\unzipped\\', 'c:\\Users\\mike\\Downloads\\rezipped.zip');
}

start();