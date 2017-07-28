require("babel-polyfill");

import cheerio from 'cheerio';
import { pd } from 'pretty-data';

class QtiCorrector {
    selectCorrectAnswer(xmlToFix) {
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

    removeEmptyAnswers(xmlToFix) {
         return new Promise((resolve, reject) => {
            console.log("Removing excess answers...");

            const $ = cheerio.load(xmlToFix, {
                ignoreWhitespace: true,
                xmlMode: true
            });

            $('response_label').map((index, element) => {
               if (typeof $(element).attr('ident') === 'undefined') {
                   $(element).remove();
               }
            });

            const fixedXml = $.html();

            console.log("Answers cleaned.")
            resolve(fixedXml);
        });
    }

    getExamTitle(xml) {
        return new Promise((resolve, reject) => {
            console.log("Finding title...");

            const $ = cheerio.load(xml, {
                ignoreWhitespace: true,
                xmlMode: true
            });

            const title = $('assessment').first().attr('title');

            console.log("Found title.")
            resolve(title);
        });
    }

    removeClassAttributes(xmlToFix) {
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

    addXmlDeclaration(currentXml) {
        return new Promise((resolve, reject) => {
            console.log("Adding XML declaration...");

            const fixedXml = '<?xml version="1.0"  encoding="UTF-8" ?>' + currentXml;

            console.log("Declaration added.")
            resolve(fixedXml);
        });
    }

    dropNodes(xml, nodeName) {
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

    unwrapContent(xml, nodeName) {
        return new Promise((resolve, reject) => {
            console.log(`Unwrapping tag ${nodeName}...`);

            const $ = cheerio.load(xml, {
                ignoreWhitespace: true,
                xmlMode: true
            });

            $(nodeName).map((index, element) => {
               const content = $(element).children();
               $(element).parent().empty().append(content);
            });

            const fixedXml = $.html();

            console.log("Unwarp completed.")
            resolve(fixedXml);
        });
    }


    fixWhitespace(xmlToFix) {
        return new Promise((resolve, reject) => {
            console.log("Fixing whitespace.");
            resolve(pd.xml(xmlToFix));
        });
    }
}

export default QtiCorrector;