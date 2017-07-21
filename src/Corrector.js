require("babel-polyfill");

import cheerio from 'cheerio';

class Corrector {
    static fixFlowTag(xmlToFix) {
        // https://stackoverflow.com/questions/11258415/how-to-modify-xml-with-jquery
        // https://www.npmjs.com/package/jquery
        // https://cheerio.js.org/
        console.log("Fixing <flow> tags...");

        const text = cheerio(xmlToFix, {
            ignoreWhitespace: true,
            xmlMode: true 
        }).text();

        console.log(text);

        console.log("Flow tags fixed.");
        return xmlToFix;
    }

    static fixWhitespace(xmlToFix) {
        // https://www.npmjs.com/package/xml-formatter
        console.log("Fixing whitespace...");



        console.log("Fixed whitespace.");
        return xmlToFix;
    }
}

export default Corrector;