// Libs
import { result, error } from 'express-easy-helper';
import { getMessage } from '../../lib/helpers/locales';

// Business
import TypeDataImplementation from '../business/parameterize/typeData/typeData.implementation';
import CallbackImplementation from '../business/parameterize/callback/callback.implementation';
import OperatorImplementation from '../business/parameterize/operator/operator.implementation';

// Transformers
import { pTypeDataTransformer } from '../transformers/p.typeData.transformer';
import { pCallbackTransformer } from '../transformers/p.callback.transformer';
import { pOperatorTransformer } from '../transformers/p.operator.transformer';

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

// get types callback
export async function getTypesCallback(req, res) {

    try {
        const callbacks = await CallbackImplementation.getTypeCallbacks();
        return result(res, 200, pCallbackTransformer.transformer(callbacks));
    } catch (exception) {
        if (exception.codeHttp && exception.key) {
            return error(res, exception.codeHttp, { message: getMessage(exception.key, 'es') });
        }
        return error(res, 500, { message: 'Server error ...' });
    }

}

// get types operator
export async function getTypesOperator(req, res) {

    try {
        const operators = await OperatorImplementation.getTypesOperator();
        return result(res, 200, pOperatorTransformer.transformer(operators));
    } catch (exception) {
        if (exception.codeHttp && exception.key) {
            return error(res, exception.codeHttp, { message: getMessage(exception.key, 'es') });
        }
        return error(res, 500, { message: 'Server error ...' });
    }

}