require("babel-polyfill");

import Nightmare from 'Nightmare';
import path from 'path';

class Downloader {
    async downloadPackage(downloadUrl, pathToSaveTo) {
        console.log(`Downloading content package from ${downloadUrl} to ${pathToSaveTo} ...`);

        require('nightmare-inline-download')(Nightmare);

        await Nightmare({
            paths: {
                downloads: path.dirname(pathToSaveTo)
            },
        }) 
            // login      
            .goto('https://study.ashworthcollege.edu/portal')
            .type('#eid', 'mchu.adm')
            .type('#pw', 'vrM5tPsl4*^H407nz')
            .click('#submit')
            // wait for the login to complete
            .wait('.all-sites-icon')
            // create a lame-o link hack
            .goto(`javascript:document.write(\"<a href='${downloadUrl}' id='click-me'>Click</a>\");`)
            // then click it
            .click('#click-me')
            // wait for the download
            .download(pathToSaveTo)
            // logout the session
            .goto('https://study.ashworthcollege.edu/portal/logout')
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