// Libs
import { result, error } from 'express-easy-helper';
import { getMessage } from '../../lib/helpers/locales';

// Business
import TypeDataBusiness from '../business/parameterize/domains/typeData.business';

// Transformers
import { pTypeDataTransformer } from '../transformers/p.typeData.transformer';

// get types data
export async function getTypesData(req, res) {

    try {
        const typesData = await TypeDataBusiness.getTypesData();
        return result(res, 200, pTypeDataTransformer.transformer(typesData));
    } catch (exception) {
        if (exception.codeHttp && exception.key) {
            return error(res, exception.codeHttp, { message: getMessage(exception.key, 'es') });
        }
        return error(res, 500, { message: 'Server error ...' });
    }

}