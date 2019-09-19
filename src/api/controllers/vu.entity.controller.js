// Libs
import { result, error } from 'express-easy-helper';
import { getMessage } from '../../lib/helpers/locales';

// Business
import EntityImplementation from '../business/vu/entity/entity.implementation';

// Transformers
import { vuEntityTransformer } from '../transformers/vu.entity.transformer';

// get entities
export async function getEntities(req, res) {

    try {
        const entities = await EntityImplementation.iGetEntities();
        return result(res, 200, vuEntityTransformer.transformer(entities));
    } catch (exception) {
        console.log("vu.entity@getEntities ---->", exception);
        if (exception.codeHttp && exception.key) {
            return error(res, exception.codeHttp, { message: getMessage(exception.key, 'es') });
        }
        return error(res, 500, { message: 'Server error ...' });
    }

}