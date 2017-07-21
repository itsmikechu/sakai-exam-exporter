import zip from './zip';

console.log("Starting.");

function start() { 
    zip.unzip('c:\\Users\\mike\\Downloads\\Original.zip', 'c:\\Users\\mike\\Downloads\\unzipped\\');

    zip.rezip('c:\\Users\\mike\\Downloads\\unzipped\\', 'c:\\Users\\mike\\Downloads\\rezipped.zip');
}

start();