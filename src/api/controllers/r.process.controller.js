// Libs
import { result, error, badRequest } from 'express-easy-helper';
import { getMessage } from '../../lib/helpers/locales';
import validator from 'validator';

// Business
import ProcessImplementation from '../business/runtime/process/process.implementation';

// Transformers
import { rProcessTransformer } from '../transformers/r.process.transformer';

// save information process
export async function saveInformationProcess(req, res) {

    const language = 'es';

    try {

        // validate m/process id
        req.checkBody("process", getMessage('m.process.process_required', language)).notEmpty();
        req.checkBody("process", getMessage('m.process.process_invalid', language)).isMongoId();

        // validate m/step id
        req.checkBody("step", getMessage('m.process.steps.step_required', language)).notEmpty();
        req.checkBody("step", getMessage('m.process.steps.step_invalid', language)).isMongoId();

        // validate data
        req.checkBody("data", getMessage('r.process.data_required', language)).notEmpty();

        const errors = req.validationErrors();
        if (errors) {
            return badRequest(res, 400, { message: errors[0].msg });
        }

        const mProcessId = req.body.process;
        const mStepId = req.body.step;
        const data = req.body.data;
        const metadata = req.body.metadata;

        const dataSave = await ProcessImplementation.iSaveInformationStep(mProcessId, mStepId, data, metadata);

        return result(res, 200, rProcessTransformer.transformer(dataSave));
    } catch (exception) {
        console.log("r.process@saveInformationProcess ---->", exception);
        if (exception.codeHttp && exception.key) {
            return error(res, exception.codeHttp, { message: getMessage(exception.key, language) });
        }
        return error(res, 500, { message: 'Server error ...' });
    }

}

// get process data
export async function getProcessData(req, res) {

    const language = 'es';

    try {

        // validate m/process id
        req.check('process', getMessage('m.process.process_required', language)).custom((value) => {
            return !validator.isEmpty(req.swagger.params.process.value);
        });
        req.check('process', getMessage('m.process.process_invalid', language)).custom((value) => {
            return validator.isMongoId(req.swagger.params.process.value);
        });

        const errors = req.validationErrors();
        if (errors) {
            return badRequest(res, 400, { message: errors[0].msg });
        }

        const mProcessId = req.swagger.params.process.value;

        const data = await ProcessImplementation.iGetInformationProcess(mProcessId);

        return result(res, 200, data);
    } catch (exception) {
        console.log("r.process@getProcessData ---->", exception);
        if (exception.codeHttp && exception.key) {
            return error(res, exception.codeHttp, { message: getMessage(exception.key, language) });
        }
        return error(res, 500, { message: 'Server error ...' });
    }

}