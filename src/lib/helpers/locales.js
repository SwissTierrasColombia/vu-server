import config from '../../config';

let languages = [];

export default (app) => {

    let fs = require('fs');
    fs.readdirSync(`${config.base}/locales`).forEach(local => {
        let json = JSON.parse(fs.readFileSync(`${config.base}/locales/${local}`, 'utf8'));
        languages[local.replace('.json', '')] = json;
    });

}

/**
 * Get message traduction
 * 
 * @param {number} code 
 * @param {string} language 
 * 
 * @return {string} Message
 */
export function getMessage(code, language) {

    language = (language) ? language : 'en';
    let jsonLanguage = languages[language];

    let message = eval("jsonLanguage." + code);
    if (!message) {
        message = "Message not found ...";
    }

    return message;
}