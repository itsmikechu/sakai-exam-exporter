import jsdom from 'jsdom';
import $ from 'jquery';

class Corrector {
    static fixFlowTag(xml) {
        // https://stackoverflow.com/questions/11258415/how-to-modify-xml-with-jquery
        // https://www.npmjs.com/package/jquery
        console.log("Fixing <flow> tags...");


        
        console.log("Flow tags fixed.");
        return xml;
    }

    static fixWhitespace(xml) {
        // https://www.npmjs.com/package/xml-formatter
        console.log("Fixing whitespace...");

        

        console.log("Fixed whitespace.");
        return xml;
    }
}

export default Corrector;