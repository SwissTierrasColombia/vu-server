// Libs
import { result, error } from 'express-easy-helper';
import { getMessage } from '../../lib/helpers/locales';

// Business
import TypeDataImplementation from '../business/parameterize/typeData/typeData.implementation';

// Transformers
import { pTypeDataTransformer } from '../transformers/p.typeData.transformer';

// get types data
export async function getTypesData(req, res) {

    try {
        const typesData = await TypeDataImplementation.getTypesData();
        return result(res, 200, pTypeDataTransformer.transformer(typesData));
    } catch (exception) {
        if (exception.codeHttp && exception.key) {
            return error(res, exception.codeHttp, { message: getMessage(exception.key, 'es') });
        }
        return error(res, 500, { message: 'Server error ...' });
    }

}