// Libs
import { result, error, badRequest } from 'express-easy-helper';
import { getMessage } from '../../lib/helpers/locales';
import validator from 'validator';

// Business
import UserImplementation from '../business/vu/user/user.implementation';

// Transformers
import { rProcessTransformer } from '../transformers/r.process.transformer';
import { vuUserTransformer } from '../transformers/vu.user.transformer';

// get processes belong to user
export async function getTaskUser(req, res) {

    const language = 'es';

    try {

        const vuUserId = req.user._id; // user session

        const processes = await UserImplementation.getTasksProceduresUser(vuUserId);

        return result(res, 200, rProcessTransformer.transformer(processes));
    } catch (exception) {
        console.log("vu.user@getTaskUser ---->", exception);
        if (exception.codeHttp && exception.key) {
            return error(res, exception.codeHttp, { message: getMessage(exception.key, language) });
        }
        return error(res, 500, { message: 'Server error ...' });
    }

}

// register user
export async function registerUser(req, res) {

    const language = 'es';

    try {

        // validate firstName
        req.checkBody("firstName", getMessage('vu.users.user_firstname_required', language)).notEmpty();

        // validate lastName
        req.checkBody("lastName", getMessage('vu.users.user_lastname_required', language)).notEmpty();

        // validate username
        req.checkBody("username", getMessage('vu.users.user_username_required', language)).notEmpty();

        // validate email
        req.checkBody("email", getMessage('vu.users.user_email_required', language)).notEmpty();
        req.checkBody("email", getMessage('vu.users.user_email_invalid', language)).isEmail();

        // validate password
        req.checkBody("password", getMessage('vu.users.user_password_required', language)).notEmpty();

        const errors = req.validationErrors();
        if (errors) {
            return badRequest(res, 400, { message: errors[0].msg });
        }

        const firstName = req.body.firstName;
        const lastName = req.body.lastName;
        const username = req.body.username.toLowerCase();
        const email = req.body.email.toLowerCase();
        const password = req.body.password;

        const user = await UserImplementation.iCreateUserCitizen(firstName, lastName, username, email, password);

        return result(res, 201, vuUserTransformer.transformer(user));
    } catch (exception) {
        console.log("vu.user@registerUser ---->", exception);
        if (exception.codeHttp && exception.key) {
            return error(res, exception.codeHttp, { message: getMessage(exception.key, language) });
        }
        return error(res, 500, { message: 'Server error ...' });
    }

}

// register user from admin
export async function registerUserFromAdmin(req, res) {

    const language = 'es';

    try {

        // validate firstName
        req.checkBody("firstName", getMessage('vu.users.user_firstname_required', language)).notEmpty();

        // validate lastName
        req.checkBody("lastName", getMessage('vu.users.user_lastname_required', language)).notEmpty();

        // validate username
        req.checkBody("username", getMessage('vu.users.user_username_required', language)).notEmpty();

        // validate email
        req.checkBody("email", getMessage('vu.users.user_email_required', language)).notEmpty();
        req.checkBody("email", getMessage('vu.users.user_email_invalid', language)).isEmail();

        // validate password
        req.checkBody("password", getMessage('vu.users.user_password_required', language)).notEmpty();

        // validate roles
        req.checkBody("roles", getMessage('vu.users.user_roles_required', language)).notEmpty();
        req.check('roles', getMessage('vu.users.user_roles_invalid', language)).custom((value) => {
            return req.body.roles !== Array;
        });

        const errors = req.validationErrors();
        if (errors) {
            return badRequest(res, 400, { message: errors[0].msg });
        }

        const firstName = req.body.firstName;
        const lastName = req.body.lastName;
        const username = req.body.username.toLowerCase();
        const email = req.body.email.toLowerCase();
        const password = req.body.password;
        const roles = req.body.roles;
        const entities = req.body.entities;

        const user = await UserImplementation.iCreateUser(firstName, lastName, email, username, password, roles, entities, true);

        return result(res, 201, vuUserTransformer.transformer(user));
    } catch (exception) {
        console.log("vu.user@registerUser ---->", exception);
        if (exception.codeHttp && exception.key) {
            return error(res, exception.codeHttp, { message: getMessage(exception.key, language) });
        }
        return error(res, 500, { message: 'Server error ...' });
    }

}

// get users from admin
export async function getUsersFromAdmin(req, res) {

    const language = 'es';

    try {

        // validation page
        req.checkQuery("page", getMessage('general.page_required', language)).notEmpty();
        req.checkQuery("page", getMessage('general.page_invalid', language)).isNumeric();

        const errors = req.validationErrors();
        if (errors) {
            return badRequest(res, 400, { message: errors[0].msg });
        }

        const page = req.swagger.params.page.value;

        let users = await UserImplementation.getUsersFromAdmin(page);
        users.docs = vuUserTransformer.transformer(users.docs);
        return result(res, 200, users);
    } catch (exception) {
        console.log("vu.user@getUsersFromAdmin ---->", exception);
        if (exception.codeHttp && exception.key) {
            return error(res, exception.codeHttp, { message: getMessage(exception.key, language) });
        }
        return error(res, 500, { message: 'Server error ...' });
    }

}


// update user from admin
export async function updateUserFromAdmin(req, res) {

    const language = 'es';

    try {

        // validate user id
        req.check('user', getMessage('vu.users.user_required', language)).custom((value) => {
            return !validator.isEmpty(req.swagger.params.user.value);
        });
        req.check('user', getMessage('vu.users.user_invalid', language)).custom((value) => {
            return validator.isMongoId(req.swagger.params.user.value);
        });

        // validate firstName
        req.checkBody("firstName", getMessage('vu.users.user_firstname_required', language)).notEmpty();

        // validate lastName
        req.checkBody("lastName", getMessage('vu.users.user_lastname_required', language)).notEmpty();

        // validate username
        req.checkBody("username", getMessage('vu.users.user_username_required', language)).notEmpty();

        // validate email
        req.checkBody("email", getMessage('vu.users.user_email_required', language)).notEmpty();
        req.checkBody("email", getMessage('vu.users.user_email_invalid', language)).isEmail();

        // validate roles
        req.checkBody("roles", getMessage('vu.users.user_roles_required', language)).notEmpty();
        req.check('roles', getMessage('vu.users.user_roles_invalid', language)).custom((value) => {
            return req.body.roles !== Array;
        });

        const errors = req.validationErrors();
        if (errors) {
            return badRequest(res, 400, { message: errors[0].msg });
        }

        const userId = req.swagger.params.user.value;
        const firstName = req.body.firstName;
        const lastName = req.body.lastName;
        const username = req.body.username.toLowerCase();
        const email = req.body.email.toLowerCase();
        const password = req.body.password;
        const roles = req.body.roles;
        const entities = req.body.entities;

        const user = await UserImplementation.iUpdateUser(userId, firstName, lastName, email, username, password, roles, entities, true);

        return result(res, 200, vuUserTransformer.transformer(user));
    } catch (exception) {
        console.log("vu.user@updateUserFromAdmin ---->", exception);
        if (exception.codeHttp && exception.key) {
            return error(res, exception.codeHttp, { message: getMessage(exception.key, language) });
        }
        return error(res, 500, { message: 'Server error ...' });
    }

}

// disable user from admin
export async function disableUserFromAdmin(req, res) {

    const language = 'es';

    try {

        // validate user id
        req.check('user', getMessage('vu.users.user_required', language)).custom((value) => {
            return !validator.isEmpty(req.swagger.params.user.value);
        });
        req.check('user', getMessage('vu.users.user_invalid', language)).custom((value) => {
            return validator.isMongoId(req.swagger.params.user.value);
        });

        const errors = req.validationErrors();
        if (errors) {
            return badRequest(res, 400, { message: errors[0].msg });
        }

        const userId = req.swagger.params.user.value;

        const user = await UserImplementation.iDisableUser(userId);

        return result(res, 200, vuUserTransformer.transformer(user));
    } catch (exception) {
        console.log("vu.user@disableUserFromAdmin ---->", exception);
        if (exception.codeHttp && exception.key) {
            return error(res, exception.codeHttp, { message: getMessage(exception.key, language) });
        }
        return error(res, 500, { message: 'Server error ...' });
    }

}

// enable user from admin
export async function enableUserFromAdmin(req, res) {

    const language = 'es';

    try {

        // validate user id
        req.check('user', getMessage('vu.users.user_required', language)).custom((value) => {
            return !validator.isEmpty(req.swagger.params.user.value);
        });
        req.check('user', getMessage('vu.users.user_invalid', language)).custom((value) => {
            return validator.isMongoId(req.swagger.params.user.value);
        });

        const errors = req.validationErrors();
        if (errors) {
            return badRequest(res, 400, { message: errors[0].msg });
        }

        const userId = req.swagger.params.user.value;

        const user = await UserImplementation.iEnableUser(userId);

        return result(res, 200, vuUserTransformer.transformer(user));
    } catch (exception) {
        console.log("vu.user@enableUserFromAdmin ---->", exception);
        if (exception.codeHttp && exception.key) {
            return error(res, exception.codeHttp, { message: getMessage(exception.key, language) });
        }
        return error(res, 500, { message: 'Server error ...' });
    }

}

// enable user from admin
export async function getUserFromAdmin(req, res) {

    const language = 'es';

    try {

        // validate user id
        req.check('user', getMessage('vu.users.user_required', language)).custom((value) => {
            return !validator.isEmpty(req.swagger.params.user.value);
        });
        req.check('user', getMessage('vu.users.user_invalid', language)).custom((value) => {
            return validator.isMongoId(req.swagger.params.user.value);
        });

        const errors = req.validationErrors();
        if (errors) {
            return badRequest(res, 400, { message: errors[0].msg });
        }

        const userId = req.swagger.params.user.value;

        const user = await UserImplementation.iGetUserFromAdmin(userId);

        return result(res, 200, vuUserTransformer.transformer(user));
    } catch (exception) {
        console.log("vu.user@getUserFromAdmin ---->", exception);
        if (exception.codeHttp && exception.key) {
            return error(res, exception.codeHttp, { message: getMessage(exception.key, language) });
        }
        return error(res, 500, { message: 'Server error ...' });
    }

}