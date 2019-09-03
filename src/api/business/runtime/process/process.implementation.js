// Libs
import validator from 'validator';
import { getMessage } from '../../../../lib/helpers/locales';
import moment from 'moment';
import config from '../../../../config';

// Business
import RProcessBusiness from './process.business';
import MProcessBusiness from '../../manage/process/process.business';
import MStepBusiness from '../../manage/step/step.business';
import MFieldBusiness from '../../manage/field/field.business';
import MUserBusiness from '../../manage/user/user.business';
import PTypeDataBusiness from '../../parameterize/typeData/typeData.business';

// Exceptions
import APIException from '../../../exceptions/api.exception';

export default class ProcessImplementation extends RProcessBusiness {

    constructor() {
        super();
    }

    static async iSaveInformationStep(mProcessId, mStepId, data, metadata, files, rProcessId) {

        // verify if the process exists
        const processFound = await MProcessBusiness.getProcessById(mProcessId);
        if (!processFound) {
            throw new APIException('m.process.process_not_exists', 404);
        }

        // verify if the step exists
        const stepFound = await MStepBusiness.getStepById(mStepId);
        if (!stepFound) {
            throw new APIException('m.process.steps.step_not_exists', 404);
        }

        // verify if the step belong to process
        if (stepFound.process.toString() !== processFound._id.toString()) {
            throw new APIException('m.process.steps.step_not_belong_process', 401);
        }

        // validate data
        const mFields = await MFieldBusiness.getFieldsByStep(mStepId);
        let errorField = false;
        let messageError = '';

        for (let i in mFields) {
            const mField = mFields[i];
            if (!mField.isPrivate) {

                if (mField.isRequired) {
                    if (!data.hasOwnProperty(mField.field) || validator.isEmpty(data[mField.field])) {
                        if (mField.typeData.toString() === PTypeDataBusiness.TYPE_DATA_FILE) {
                            if (!files || !files.hasOwnProperty(mField.field)) {
                                errorField = true;
                                messageError = getMessage('r.process.data_field_type_required', 'es').replace('{{field}}', mField.description);
                                break;
                            }
                        } else {
                            errorField = true;
                            messageError = getMessage('r.process.data_field_type_required', 'es').replace('{{field}}', mField.description);
                            break;
                        }
                    }
                }

                // validate data through type data
                const valueField = data[mField.field];
                if (valueField) {
                    errorField = !await PTypeDataBusiness.verifyValueFromTypeData(mField.typeData, valueField, mField.metadata);
                    if (errorField) {
                        messageError = getMessage('r.process.data_field_type_invalid', 'es').replace('{{field}}', mField.description);
                        break;
                    }
                }

            }
        }

        if (errorField) {
            throw new APIException('-', 401, messageError);
        }

        console.log('bien I');

        let runtimeProcessFound = await this.getProcessById(rProcessId);
        if (runtimeProcessFound) {

            // update step in rProcess
            // metadata = (metadata) ? metadata : {};
            // await this.updateProcessStep(rProcessId, mStepId, data, metadata);
            // runtimeProcessFound = await this.getProcessById(rProcessId);
        } else {

            // create runtime process
            const rSteps = [];
            const mSteps = await MStepBusiness.getStepsFromProcess(mProcessId);

            for (let i in mSteps) {
                const mStep = mSteps[i];
                let activeStep = false;
                let dataStep = {};
                if (mStep._id.toString() === mStepId.toString()) {
                    // save files
                    for (let i in mFields) {
                        const mField = mFields[i];
                        if (!mField.isPrivate) {
                            if (mField.typeData.toString() === PTypeDataBusiness.TYPE_DATA_FILE) {
                                const file = files[mField.field];
                                const newName = moment().unix() + '_' + file.name.replace(' ', '_');
                                const path = `/assets/${newName}`;
                                await file.mv(`${config.base}${path}`);
                                data[mField.field] = path;
                            }
                        }
                    }
                    activeStep = true;
                    dataStep = data;
                }
                rSteps.push({
                    step: mStep._id.toString(),
                    active: activeStep,
                    data: dataStep,
                    metadata: {}
                });
            }

            runtimeProcessFound = await this.createProcess(mProcessId, rSteps);
        }

        return runtimeProcessFound;
    }

    static async iGetInformationProcess(rProcessId) {

        // verify if the process exists
        const processFound = await this.getProcessById(rProcessId);
        if (!processFound) {
            throw new APIException('m.process.process_not_exists', 404);
        }

        return processFound;
    }

    static async getProcessesByUser(username) {

        const users = await MUserBusiness.getUsersByUsername(username);

        const allProcesses = [];

        for (let i in users) {
            const user = users[i];

            const mProcessId = user.process.toString();

            const steps = await MStepBusiness.getStepsByProcessAndRoles(mProcessId, user.roles);
            const stepsId = [];
            for (let j = 0; j < steps.length; j++) {
                stepsId.push(steps[j]._id.toString());
            }
            const rProcesses = await this.getProcessesByProcessAndSteps(mProcessId, stepsId, ['process']);
            for (let j = 0; j < rProcesses.length; j++) {
                allProcesses.push(rProcesses[j]);
            }

        }

        return allProcesses;
    }

    static async getDataStartProcedure(mProcessId) {

        // verify if the process exists
        const processFound = await MProcessBusiness.getProcessById(mProcessId);
        if (!processFound) {
            throw new APIException('m.process.process_not_exists', 404);
        }

        const firstMStep = await MStepBusiness.getStepFirstFromProcess(mProcessId);

        let mFields = [];
        if (firstMStep) {
            mFields = await MFieldBusiness.getFieldsByStep(firstMStep._id.toString());
        }

        mFields = mFields.filter(item => { return item.isPrivate === false; });

        return {
            fields: mFields,
            step: firstMStep._id.toString()
        };
    }


}