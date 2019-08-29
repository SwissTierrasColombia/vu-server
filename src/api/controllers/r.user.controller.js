// Libs
import { result, error, badRequest } from 'express-easy-helper';
import { getMessage } from '../../lib/helpers/locales';
import validator from 'validator';

// Business
import ProcessImplementation from '../business/runtime/process/process.implementation';

// Transformers
import { rProcessTransformer } from '../transformers/r.process.transformer';

// get processes belong to user
export async function getProcessesBelongToUser(req, res) {

    const language = 'es';

    try {

        // validate username
        req.check('username', getMessage('m.process.users.username_required', language)).custom((value) => {
            return !validator.isEmpty(req.swagger.params.username.value);
        });

        const errors = req.validationErrors();
        if (errors) {
            return badRequest(res, 400, { message: errors[0].msg });
        }

        const username = req.swagger.params.username.value.trim();

        const processes = await ProcessImplementation.getProcessesByUser(username);

        return result(res, 200, rProcessTransformer.transformer(processes));
    } catch (exception) {
        console.log("r.user@getProcessesBelongToUser ---->", exception);
        if (exception.codeHttp && exception.key) {
            return error(res, exception.codeHttp, { message: getMessage(exception.key, language) });
        }
        return error(res, 500, { message: 'Server error ...' });
    }

}