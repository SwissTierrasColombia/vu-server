// Libs
import { result, error, badRequest } from 'express-easy-helper';
import { getMessage } from '../../lib/helpers/locales';
import validator from 'validator';
import fs from 'fs';
import config from '../../config';

// Business
import ProcessImplementation from '../business/pm/runtime/process/process.implementation';

// Transformers
import { rProcessTransformer } from '../transformers/r.process.transformer';
import { mFieldTransformer } from '../transformers/m.field.transformer';

// save information process
export async function saveInformationProcess(req, res) {

    const language = 'es';

    try {

        // validate m/process id
        req.checkBody("mProcess", getMessage('m.process.process_required', language)).notEmpty();
        req.checkBody("mProcess", getMessage('m.process.process_invalid', language)).isMongoId();

        // validate m/step id
        req.checkBody("step", getMessage('m.process.steps.step_required', language)).notEmpty();
        req.checkBody("step", getMessage('m.process.steps.step_invalid', language)).isMongoId();

        const errors = req.validationErrors();
        if (errors) {
            return badRequest(res, 400, { message: errors[0].msg });
        }

        const files = req.files;
        const mProcessId = req.body.mProcess;
        const rProcessId = req.body.rProcess;
        const mStepId = req.body.step;
        const metadata = req.body.metadata;
        const vuUserId = req.user._id; // user session

        const data = {};
        for (let prop in req.body) {
            if (prop.indexOf('dproperty_') !== -1) {
                data[prop.replace('dproperty_', '')] = req.body[prop];
            }
        }

        const dataSave = await ProcessImplementation.iSaveInformationStep(mProcessId, mStepId, data, metadata, files, rProcessId, vuUserId);

        return result(res, 200, rProcessTransformer.transformer(dataSave));
    } catch (exception) {
        console.log("r.process@saveInformationProcess ---->", exception);
        if (exception.codeHttp && exception.key) {
            const messageError = (exception.errorMessage) ? exception.errorMessage : getMessage(exception.key, language);
            return error(res, exception.codeHttp, { message: messageError });
        }
        return error(res, 500, { message: 'Server error ...' });
    }

}

// get process data
export async function getProcess(req, res) {

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

        const rProcessId = req.swagger.params.process.value;
        const vuUserId = req.user._id; // user session

        const data = await ProcessImplementation.iGetInformationProcess(rProcessId, vuUserId);

        return result(res, 200, rProcessTransformer.transformer(data));
    } catch (exception) {
        console.log("r.process@getProcess ---->", exception);
        if (exception.codeHttp && exception.key) {
            return error(res, exception.codeHttp, { message: getMessage(exception.key, language) });
        }
        return error(res, 500, { message: 'Server error ...' });
    }

}

// get data start procedure
export async function getDataStartProcedure(req, res) {

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
        const vuUserId = req.user._id; // user session

        const dataStartProcedure = await ProcessImplementation.getDataStartProcedure(mProcessId, vuUserId);

        const data = {
            fields: dataStartProcedure.fields,
            process: mProcessId,
            step: dataStartProcedure.step
        };

        return result(res, 200, data);
    } catch (exception) {
        console.log("r.process@getDataStartProcedure ---->", exception);
        if (exception.codeHttp && exception.key) {
            return error(res, exception.codeHttp, { message: getMessage(exception.key, language) });
        }
        return error(res, 500, { message: 'Server error ...' });
    }

}

// get data continue procedure
export async function getDataContinueProcedure(req, res) {

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

        const rProcessId = req.swagger.params.process.value;
        const vuUserId = req.user._id; // user session

        const dataContinueProcedure = await ProcessImplementation.getDataContinueProcedure(rProcessId, vuUserId);

        const data = {
            fields: dataContinueProcedure.fields,
            process: rProcessId,
            step: dataContinueProcedure.step
        };

        return result(res, 200, data);
    } catch (exception) {
        console.log("r.process@getDataContinueProcedure ---->", exception);
        if (exception.codeHttp && exception.key) {
            return error(res, exception.codeHttp, { message: getMessage(exception.key, language) });
        }
        return error(res, 500, { message: 'Server error ...' });
    }

}

// download file
export async function downloadFile(req, res) {

    const language = 'es';

    try {

        // validate m/process id
        req.check('process', getMessage('m.process.process_required', language)).custom((value) => {
            return !validator.isEmpty(req.swagger.params.process.value);
        });
        req.check('process', getMessage('m.process.process_invalid', language)).custom((value) => {
            return validator.isMongoId(req.swagger.params.process.value);
        });

        req.checkQuery("field", getMessage('m.process.fields.field_name_required', language)).notEmpty();

        req.checkQuery("step", getMessage('m.process.steps.step_required', language)).notEmpty();
        req.checkQuery("step", getMessage('m.process.steps.step_invalid', language)).isMongoId();

        const errors = req.validationErrors();
        if (errors) {
            return badRequest(res, 400, { message: errors[0].msg });
        }

        const rProcessId = req.swagger.params.process.value;
        const nameField = req.swagger.params.field.value;
        const mStepId = req.swagger.params.step.value;
        const vuUserId = req.user._id; // user session

        const dataFile = await ProcessImplementation.iGetDataFile(rProcessId, mStepId, nameField, vuUserId);
        if (dataFile) {
            const file = fs.readFileSync(config.base + dataFile.url);
            res.writeHead(200, { 'Content-Type': dataFile.mimetype + ',' + dataFile.extension });
            res.end(file, 'binary');
        } else {
            return badRequest(res, 404, { message: getMessage('m.process.fields.field_invalid', language) });
        }


    } catch (exception) {
        console.log("r.process@downloadFile ---->", exception);
        if (exception.codeHttp && exception.key) {
            return error(res, exception.codeHttp, { message: getMessage(exception.key, language) });
        }
        return error(res, 500, { message: 'Server error ...' });
    }

}