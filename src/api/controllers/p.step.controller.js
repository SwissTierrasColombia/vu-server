// Libs
import { result, error } from 'express-easy-helper';
import { getMessage } from '../../lib/helpers/locales';

// Business
import StepBusiness from '../business/parameterize/step/step.business';

// Transformers
import { pStepTransformer } from '../transformers/p.step.transformer';

// get steps
export async function getSteps(req, res) {

    try {
        const steps = await StepBusiness.getSteps();
        return result(res, 200, pStepTransformer.transformer(steps));
    } catch (exception) {
        if (exception.codeHttp && exception.key) {
            return error(res, exception.codeHttp, { message: getMessage(exception.key, 'es') });
        }
        return error(res, 500, { message: 'Server error ...' });
    }

}