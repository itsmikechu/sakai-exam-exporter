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
            });
            
            const fixtedXml = $.html();
            
            console.log("Answers selected.")
            resolve(fixtedXml);
        });
    }

    static removeClassAttributes(xmlToFix) {
        return new Promise((resolve, reject) => {
            console.log("Removing class='Block' attributes...");

            const $ = cheerio.load(xmlToFix, {
                ignoreWhitespace: true,
                xmlMode: true 
            });

            $('[class="Block"]').map((index, element) => {
                $(element).removeAttr('class');
            });
            
            const fixtedXml = $.html();
            
            console.log("Answers selected.")
            resolve(fixtedXml);
        });
    }

    static fixWhitespace(xmlToFix) {
        return new Promise((resolve, reject) => {
            console.log("Fixing whitespace.");
            resolve(pd.xmlmin(xmlToFix));
        });
    }
}

export default Corrector;