require("babel-polyfill"); 

class Downloader {
    static downloadPackage(downloadUrl, pathToSaveTo) {
        console.log(`Downloading content package from ${downloadUrl} to ${pathToSaveTo} ...`);

        const loginUrl = 'https://study.ashworthcollege.edu/portal';

        const Nightmare = require('nightmare');
        require('nightmare-inline-download')(Nightmare);

        const nightmare = new Nightmare()
        return nightmare
            // login      
            .goto(loginUrl)
            .type('#eid', 'mchu.adm')
            .type('#pw', 'vrM5tPsl4*^H407nz')
            .click('#submit')
            // wait for the login to complete
            .wait('.all-sites-icon')
            // create a lame-o link hack
            .goto(`javascript:document.write(\"<a href='${downloadUrl}' id='click-me'>Click</a>\");`)
            // then click it
            .click('#click-me')
            .download(pathToSaveTo)
            .end()
            .then(() => {
                console.log("Download completed.")
            })
            .catch(function (error) {
                console.error('Fail:', error);
            });
    }
}

export default Downloader;