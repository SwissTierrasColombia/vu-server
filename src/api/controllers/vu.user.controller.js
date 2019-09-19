// Libs
import { result, error, badRequest } from 'express-easy-helper';
import { getMessage } from '../../lib/helpers/locales';
import validator from 'validator';

// Business
import UserImplementation from '../business/vu/user/user.implementation';

// Transformers
import { rProcessTransformer } from '../transformers/r.process.transformer';

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