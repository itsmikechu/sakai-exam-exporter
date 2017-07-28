require("babel-polyfill");

import cheerio from 'cheerio';
import { pd } from 'pretty-data';

class ManifestCorretcor {
    fixWhitespace(xmlToFix) {
        return new Promise((resolve, reject) => {
            console.log("Fixing whitespace.");
            resolve(pd.xml(xmlToFix));
        }); 
    }

    addSchemaTag(xmlToFix) {
        return new Promise((resolve, reject) => {
            console.log("Adding schema...");

            const $ = cheerio.load(xmlToFix, {
                ignoreWhitespace: true,
                xmlMode: true
            });

            $('metadata').prepend('<schema>IMS Content</schema>');

            const fixedXml = $.html();

            console.log("schema tag added.")
            resolve(fixedXml);
        });
    }

    setTitle(xml, title) {
        return new Promise((resolve, reject) => {
            console.log(`Setting title to ${title}...`);

            const fixedXml = xml.split('exportAssessment').join(title);

            console.log("Title set.")

            resolve(fixedXml);
        });
    } 

    addSchemaVersionTag(xmlToFix) {
        return new Promise((resolve, reject) => {
            console.log("Adding schemaversion tag...");

            const $ = cheerio.load(xmlToFix, {
                ignoreWhitespace: true,
                xmlMode: true
            });

            $('metadata').prepend('<schemaversion>1.1.3</schemaversion>');

            const fixedXml = $.html();

            console.log("schemaversion tag added.")
            resolve(fixedXml);
        });
    }
}

export default ManifestCorretcor;