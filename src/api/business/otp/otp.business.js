import config from '../../../config';
import otplib from 'otplib';
import crypto from 'crypto';
import authenticator from 'otplib/authenticator';

export default class OTPBusiness {

    /**
     * Generate a code OTP
     * 
     * @return {object} Data token
     */
    static async generateOTP() {

        const secret = authenticator.generateSecret();

        authenticator.options = {
            secret,
            step: config.otp.step,
            algorithm: config.otp.algorithm,
            digits: config.otp.digits,
            crypto
        };

        const token = authenticator.generate();
        return {
            secret, step: config.otp.step, token
        };
    }

    /**
     * Verify token OTP
     * 
     * @param {string} secret 
     * @param {string} token 
     * 
     * @return {boolean} is valid ?
     */
    static async verifyOTP(secret, token) {
        try {
            const isValid = authenticator.check(token, secret);
            return isValid;
        } catch (error) {
            return false;
        }
    }


}