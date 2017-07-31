require("babel-polyfill");

import Nightmare from 'Nightmare';
import path from 'path';
import config from './config.json';

class Downloader {
    async downloadPackage(downloadUrl, pathToSaveTo) {
        console.log(`Downloading content package from ${downloadUrl} to ${pathToSaveTo} ...`);

        require('nightmare-download-manager')(Nightmare);

        const nightmare = Nightmare({
            paths: {
                downloads: path.dirname(pathToSaveTo)
            },
        });

        await nightmare.downloadManager()
            .on('download', function (state, downloadItem) {
                if (state == 'started') {
                    nightmare.emit('download', pathToSaveTo, downloadItem);
                }
            })
            // login      
            .goto('https://study.ashworthcollege.edu/portal')
            .type('#eid', config.sakaiUserIDForDownloading)
            .type('#pw', config.sakaiPasswordForDownloading)
            .click('#submit')
            // wait for the login to complete
            .wait('.all-sites-icon')
            // create a lame-o link hack
            .goto(`javascript:document.write(\"<a href='${downloadUrl}' id='click-me'>Click</a>\");`)
            // then click it
            .click('#click-me')
            // wait for the download
            .waitDownloadsComplete()
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