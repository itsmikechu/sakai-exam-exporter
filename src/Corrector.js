import jsdom from 'jsdom';
import $ from 'jquery';

class Corrector {
    static fixFlowTag() {
        // https://stackoverflow.com/questions/11258415/how-to-modify-xml-with-jquery
        // https://www.npmjs.com/package/jquery
        console.log("Fixing <flow> tags...");

        console.log("Flow tags fixed.");
    }

    static fixWhitespace() {
        console.log("Fixing whitespace...");

        console.log("Fixed whitespace.");
    }
}

export default Corrector;