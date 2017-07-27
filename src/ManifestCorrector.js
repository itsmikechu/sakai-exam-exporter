require("babel-polyfill");

import cheerio from 'cheerio';
import { pd } from 'pretty-data';

class ManifestCorretcor {
    static fixWhitespace(xmlToFix) {
        return new Promise((resolve, reject) => {
            console.log("Fixing whitespace.");
            resolve(pd.xml(xmlToFix));
        }); 
    }

    static addSchemaTag(xmlToFix) {
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

    static addSchemaVersionTag(xmlToFix) {
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