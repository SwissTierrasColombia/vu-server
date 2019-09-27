// Libs
import config from '../../../config';
import nodemailer from 'nodemailer';
import fs from 'fs';

export default class EmailBusiness {

    constructor() {

    }

    static async sendEmail(to, subject, html) {

        let transporter = nodemailer.createTransport({
            host: config.nodemailer.host,
            port: config.nodemailer.port,
            auth: config.nodemailer.auth
        });

        let mailOptions = {
            from: config.nodemailer.from,
            to,
            subject,
            html
        };

        try {
            let response = await transporter.sendMail(mailOptions);
            return response;
        } catch (error) {
            return null;
        }
    }

    static async getTemplateEmail(template, data) {

        let htmlStream = '';

        try {
            const path = config.base + '/views/templates/' + template + '.html';
            htmlStream = fs.readFileSync(path, 'utf8');
            if (data) {
                for (let property in data) {
                    htmlStream = htmlStream.replace(new RegExp('{' + property + '}', 'g'), data[property]);
                }
            }
        } catch (error) {
            htmlStream = '';
        }

        return htmlStream;
    }

}