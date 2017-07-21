require("babel-polyfill");

import cheerio from 'cheerio';
import { pd } from 'pretty-data';

class Corrector {
    static selectCorrectAnswer(xmlToFix) {
        return new Promise((resolve, reject) => {
            console.log("Selecting correct answer...");

            const $ = cheerio.load(xmlToFix, {
                ignoreWhitespace: true,
                xmlMode: true
            });

            $('displayfeedback[linkrefid="Correct"]').map((element) => {
                element.parent().find('setvar')[0].text(1); // Broken
            });

            resolve(xmlToFix);
        });
    }

    static fixWhitespace(xmlToFix) {
        return new Promise((resolve, reject) => {
            console.log("Fixing whitespace...");
            resolve(pd.xml(xmlToFix));
        });
    }
}

export default Corrector;