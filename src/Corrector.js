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

            $('displayfeedback[linkrefid="Correct"]').map((index, element) => {
                $(element).parent().find('setvar').first().text(1);
                //console.log(`Set correct answer to ${$(element).parent().find('varequal').first().text()}`);
            });
            
            const fixtedXml = $.html();
            
            console.log("Answers selected.")
            resolve(fixtedXml);
        });
    }

    static fixWhitespace(xmlToFix) {
        return new Promise((resolve, reject) => {
            console.log("Fixing whitespace.");
            resolve(pd.xml(xmlToFix));
        });
    }
}

export default Corrector;