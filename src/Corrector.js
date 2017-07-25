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
            $('displayfeedback[linkrefid="InCorrect"]').map((index, element) => {
                $(element).parent().find('setvar').first().text(0);
            }); 

            const fixedXml = $.html();

            console.log("Answers selected.")
            resolve(fixedXml); 
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

            const fixedXml = $.html();

            console.log("Answers selected.")
            resolve(fixedXml);
        });
    }

    static dropNodes(xml, nodeName) {
        return new Promise((resolve, reject) => {
            console.log(`Dropping tag ${nodeName}...`);

            const $ = cheerio.load(xml, {
                ignoreWhitespace: true,
                xmlMode: true
            });

            $(nodeName).map((index, element) => {
                $(element).remove();
            });

            const fixedXml = $.html();

            console.log("Drops completed.")
            resolve(fixedXml);
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