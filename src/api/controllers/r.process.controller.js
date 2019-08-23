// Libs
import { result, error, badRequest } from 'express-easy-helper';
import { getMessage } from '../../lib/helpers/locales';
import validator from 'validator';

// Business
import ProcessImplementation from '../business/runtime/process/process.implementation';

// save information process
export async function saveInformationProcess(req, res) {

    const language = 'es';

    try {

        // validate m/process id
        req.check('process', getMessage('m.process.process_required', language)).custom((value) => {
            return !validator.isEmpty(req.swagger.params.process.value);
        });
        req.check('process', getMessage('m.process.process_invalid', language)).custom((value) => {
            return validator.isMongoId(req.swagger.params.process.value);
        });

        // validate m/step id
        req.check('step', getMessage('m.process.steps.step_required', language)).custom((value) => {
            return !validator.isEmpty(req.swagger.params.step.value);
        });
        req.check('step', getMessage('m.process.steps.step_invalid', language)).custom((value) => {
            return validator.isMongoId(req.swagger.params.step.value);
        });

        const errors = req.validationErrors();
        if (errors) {
            return badRequest(res, 400, { message: errors[0].msg });
        }

        const mProcessId = req.swagger.params.process.value;
        const mStepId = req.swagger.params.step.value;
        const data = req.body.data.value;



        return result(res, 200, {});
    } catch (exception) {
        console.log("r.process@saveInformationProcess ---->", exception);
        if (exception.codeHttp && exception.key) {
            return error(res, exception.codeHttp, { message: getMessage(exception.key, language) });
        }
        return error(res, 500, { message: 'Server error ...' });
    }

}