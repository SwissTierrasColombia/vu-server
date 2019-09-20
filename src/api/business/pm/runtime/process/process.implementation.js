// Libs
import validator from 'validator';
import { getMessage } from '../../../../../lib/helpers/locales';
import moment from 'moment';
import config from '../../../../../config';
import path from 'path';

// Business
import RProcessBusiness from './process.business';
import MProcessBusiness from '../../manage/process/process.business';
import MStepBusiness from '../../manage/step/step.business';
import MFieldBusiness from '../../manage/field/field.business';
import MUserBusiness from '../../manage/user/user.business';
import PTypeDataBusiness from '../../parameterize/typeData/typeData.business';
import PCallbackBusiness from '../../parameterize/callback/callback.business';
import POperatorBusiness from '../../parameterize/operator/operator.business';
import VUUserBusiness from '../../../vu/user/user.business';
import QueueBusiness from '../../../queues/queue.business';

// Exceptions
import APIException from '../../../../exceptions/api.exception';

export default class ProcessImplementation extends RProcessBusiness {

    constructor() {
        super();
    }

    static async iSaveInformationStep(mProcessId, mStepId, data, metadata, files, rProcessId, vuUserId) {

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

        // verify if the user session exists
        const userFound = await VUUserBusiness.getUserById(vuUserId);
        if (!userFound) {
            throw new APIException('m.process.users.user_not_exists', 404);
        }

        // verify that the user has access to the step
        const entitiesUser = userFound.entities;
        const entityIdFound = entitiesUser.find(entityUserId => {
            return entityUserId.toString() === stepFound.entity.toString();
        });
        const hasAccessEntity = (entityIdFound) ? true : false;
        let hasAccessRole = false;
        const rolesUser = userFound.roles;
        const rolesStep = stepFound.roles;
        rolesUser.forEach(roleUserId => {
            const has = rolesStep.find(roleStepId => {
                return roleStepId.toString() === roleUserId.toString();
            });
            if (has) {
                hasAccessRole = true;
            }
        });
        if (!hasAccessEntity || !hasAccessRole) {
            throw new APIException('r.process.access_denied_step', 401);
        }

        let runtimeProcessFound = await this.getProcessById(rProcessId);

        // validate data
        const mFields = await MFieldBusiness.getFieldsByStep(mStepId);
        let errorField = false;
        let messageError = '';

        let skipFiles = [];

        for (let i in mFields) {
            const mField = mFields[i];
            if (!mField.isPrivate) {

                if (mField.isRequired) {
                    if (!data.hasOwnProperty(mField.field) || validator.isEmpty(data[mField.field])) {


                        if (mField.typeData.toString() === PTypeDataBusiness.TYPE_DATA_FILE) {
                            if (!files || !files.hasOwnProperty(mField.field)) {
                                if (runtimeProcessFound) {
                                    const getStepToUpdate = runtimeProcessFound.steps.find(item => {
                                        return item.step._id.toString() === mStepId.toString();
                                    });
                                    if (getStepToUpdate.data) {
                                        const dataFile = getStepToUpdate.data[mField.field];
                                        if (dataFile) {
                                            data[mField.field] = dataFile;
                                            skipFiles.push(mField.field);
                                            continue;
                                        }
                                    }
                                }
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


        if (runtimeProcessFound) {

            if (!runtimeProcessFound.active) {
                throw new APIException('r.process.process_is_closing', 401);
            }

            // update step in rProcess
            metadata = (metadata) ? metadata : {};

            for (let i in mFields) {
                const mField = mFields[i];
                if (skipFiles.indexOf(mField.field) === -1) {
                    if (!mField.isPrivate) {
                        if (mField.typeData.toString() === PTypeDataBusiness.TYPE_DATA_FILE) {
                            const file = files[mField.field];
                            const newName = moment().unix() + '_' + file.name.replace(' ', '_');
                            const pathFile = `/assets/${newName}`;
                            await file.mv(`${config.base}${pathFile}`);
                            data[mField.field] = {
                                url: pathFile,
                                mimetype: file.mimetype,
                                extension: (newName.substring(newName.indexOf('.'))).toLowerCase()
                            };
                        }
                    }
                }
            }

            await this.updateProcessStep(rProcessId, mStepId, data, metadata, vuUserId);
            runtimeProcessFound = await this.getProcessById(rProcessId);

        } else {

            // create runtime process
            const rSteps = [];
            const mSteps = await MStepBusiness.getStepsFromProcess(mProcessId);

            for (let i in mSteps) {
                const mStep = mSteps[i];
                let activeStep = false;
                let dataStep = {};
                let modifiedBy = null;
                if (mStep._id.toString() === mStepId.toString()) {
                    // save files
                    for (let i in mFields) {
                        const mField = mFields[i];
                        if (!mField.isPrivate) {
                            if (mField.typeData.toString() === PTypeDataBusiness.TYPE_DATA_FILE) {
                                const file = files[mField.field];
                                const newName = moment().unix() + '_' + file.name.replace(' ', '_');
                                const pathFile = `/assets/${newName}`;
                                await file.mv(`${config.base}${pathFile}`);
                                data[mField.field] = {
                                    url: pathFile,
                                    mimetype: file.mimetype,
                                    extension: (newName.substring(newName.indexOf('.'))).toLowerCase()
                                };
                            }
                        }
                    }
                    activeStep = true;
                    dataStep = data;
                    modifiedBy = vuUserId;
                }
                rSteps.push({
                    step: mStep._id.toString(),
                    active: activeStep,
                    data: dataStep,
                    metadata: {},
                    modifiedBy
                });
            }

            runtimeProcessFound = await this.createProcess(mProcessId, vuUserId, rSteps);
            await QueueBusiness.addJob(QueueBusiness.QUEUE_TYPE_PROCEDURES, { rProcessId: runtimeProcessFound._id.toString() });
        }

        return await this.iGetInformationProcess(runtimeProcessFound._id.toString(), vuUserId);
    }

    static async iGetInformationProcess(rProcessId, vuUserId) {

        // verify if the process exists
        let processFound = await this.getProcessById(rProcessId);
        processFound = JSON.parse(JSON.stringify(processFound));
        if (!processFound) {
            throw new APIException('m.process.process_not_exists', 404);
        }

        // verify if the user session exists
        const userFound = await VUUserBusiness.getUserById(vuUserId);
        if (!userFound) {
            throw new APIException('m.process.users.user_not_exists', 404);
        }

        const steps = processFound.steps;
        let hasAccess = false;
        for (let i = 0; i < steps.length; i++) {
            const step = steps[i];
            const fields = await MFieldBusiness.getFieldsByStep(step.step._id.toString());
            step.fields = fields.filter(item => {
                return item.isPrivate === false;
            });

            const manageStep = await MStepBusiness.getStepById(step.step._id.toString());

            // verify that the user has access to the step
            const entitiesUser = userFound.entities;
            const entityIdFound = entitiesUser.find(entityUserId => {
                return entityUserId.toString() === manageStep.entity.toString();
            });
            const hasAccessEntity = (entityIdFound) ? true : false;

            let hasAccessRole = false;
            const rolesUser = userFound.roles;
            const rolesStep = manageStep.roles;
            rolesUser.forEach(roleUserId => {
                const has = rolesStep.find(roleStepId => {
                    return roleStepId.toString() === roleUserId.toString();
                });
                if (has) {
                    hasAccessRole = true;
                }
            });
            if (hasAccessEntity && hasAccessRole) {
                hasAccess = true;
            }

        }

        if (!hasAccess) {
            throw new APIException('r.process.access_denied_step', 401);
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

    static async getDataStartProcedure(mProcessId, vuUserId) {

        // verify if the process exists
        const processFound = await MProcessBusiness.getProcessById(mProcessId);
        if (!processFound) {
            throw new APIException('m.process.process_not_exists', 404);
        }

        if (!processFound.active) {
            throw new APIException('m.process.process_not_deploy_yet', 401);
        }

        // verify if the user session exists
        const userFound = await VUUserBusiness.getUserById(vuUserId);
        if (!userFound) {
            throw new APIException('m.process.users.user_not_exists', 404);
        }

        // search first step from process
        const firstMStep = await MStepBusiness.getStepFirstFromProcess(mProcessId);
        let mFields = [];
        if (firstMStep) {
            mFields = await MFieldBusiness.getFieldsByStep(firstMStep._id.toString());

            // verify that the user has access to the step
            const entitiesUser = userFound.entities;
            const entityIdFound = entitiesUser.find(entityUserId => {
                return entityUserId.toString() === firstMStep.entity.toString();
            });
            const hasAccessEntity = (entityIdFound) ? true : false;
            let hasAccessRole = false;
            const rolesUser = userFound.roles;
            const rolesStep = firstMStep.roles;
            rolesUser.forEach(roleUserId => {
                const has = rolesStep.find(roleStepId => {
                    return roleStepId.toString() === roleUserId.toString();
                });
                if (has) {
                    hasAccessRole = true;
                }
            });
            if (!hasAccessEntity || !hasAccessRole) {
                throw new APIException('r.process.access_denied_step', 401);
            }

        }

        mFields = mFields.filter(item => { return item.isPrivate === false; });

        return {
            fields: mFields,
            step: (firstMStep) ? firstMStep._id.toString() : ''
        };
    }

    static async getDataContinueProcedure(rProcessId, vuUserId) {

        // verify if the process exists
        const rProcessFound = await this.getProcessById(rProcessId);
        if (!rProcessFound) {
            throw new APIException('m.process.process_not_exists', 404);
        }

        // verify if the user session exists
        const userFound = await VUUserBusiness.getUserById(vuUserId);
        if (!userFound) {
            throw new APIException('m.process.users.user_not_exists', 404);
        }

        const mStepActive = rProcessFound.steps.find((step) => {
            return step.active === true;
        });
        const mStepIdActive = mStepActive.step._id.toString();
        const mStepFound = await MStepBusiness.getStepById(mStepIdActive);

        let mFields = [];
        if (mStepFound) {
            mFields = await MFieldBusiness.getFieldsByStep(mStepFound._id.toString());

            // verify that the user has access to the step
            const entitiesUser = userFound.entities;
            const entityIdFound = entitiesUser.find(entityUserId => {
                return entityUserId.toString() === mStepFound.entity.toString();
            });
            const hasAccessEntity = (entityIdFound) ? true : false;
            let hasAccessRole = false;
            const rolesUser = userFound.roles;
            const rolesStep = mStepFound.roles;
            rolesUser.forEach(roleUserId => {
                const has = rolesStep.find(roleStepId => {
                    return roleStepId.toString() === roleUserId.toString();
                });
                if (has) {
                    hasAccessRole = true;
                }
            });
            if (!hasAccessEntity || !hasAccessRole) {
                throw new APIException('r.process.access_denied_step', 401);
            }
        }

        mFields = mFields.filter(item => { return item.isPrivate === false; });

        return {
            fields: mFields,
            step: (mStepFound) ? mStepFound._id.toString() : ''
        };
    }

    static async iGetDataFile(rProcessId, mStepId, nameField, vuUserId) {

        // verify if the process exists
        const processFound = await this.getProcessById(rProcessId);
        if (!processFound) {
            throw new APIException('m.process.process_not_exists', 404);
        }

        // verify if the user session exists
        const userFound = await VUUserBusiness.getUserById(vuUserId);
        if (!userFound) {
            throw new APIException('m.process.users.user_not_exists', 404);
        }

        const steps = processFound.steps;
        let hasAccess = false;
        for (let i = 0; i < steps.length; i++) {
            const step = steps[i];

            const manageStep = await MStepBusiness.getStepById(step.step._id.toString());

            // verify that the user has access to the step
            const entitiesUser = userFound.entities;
            const entityIdFound = entitiesUser.find(entityUserId => {
                return entityUserId.toString() === manageStep.entity.toString();
            });
            const hasAccessEntity = (entityIdFound) ? true : false;

            let hasAccessRole = false;
            const rolesUser = userFound.roles;
            const rolesStep = manageStep.roles;
            rolesUser.forEach(roleUserId => {
                const has = rolesStep.find(roleStepId => {
                    return roleStepId.toString() === roleUserId.toString();
                });
                if (has) {
                    hasAccessRole = true;
                }
            });
            if (hasAccessEntity && hasAccessRole) {
                hasAccess = true;
                break;
            }

        }

        if (!hasAccess) {
            throw new APIException('r.process.access_denied_step', 401);
        }

        let dataImage = null;
        const stepsProcess = processFound.steps;
        const stepFound = stepsProcess.find(item => {
            return item.step._id.toString() === mStepId.toString();
        });
        if (stepFound.data) {
            if (stepFound.data.hasOwnProperty(nameField)) {
                dataImage = {
                    url: stepFound.data[nameField].url,
                    mimetype: stepFound.data[nameField].mimetype,
                    extension: stepFound.data[nameField].extension
                };
            }
        }


        return dataImage;
    }

    static async validateProcedure(rProcessId) {

        const rProcess = await this.getProcessById(rProcessId);
        let isOver = false;

        if (rProcess) {

            const stepActive = rProcess.steps.find(step => {
                return step.active === true;
            });

            const rules = stepActive.step.rules;
            for (let i = 0; i < rules.length; i++) {
                const rule = rules[i];

                const conditions = rule.conditions;
                let conditionsValid = 0;
                for (let j = 0; j < conditions.length; j++) {
                    const condition = conditions[j];

                    const field = await MFieldBusiness.getFieldById(condition.field);

                    // confirm that the operator belongs to type field
                    let operatorFound = null;
                    const pTypeData = await PTypeDataBusiness.getTypeDataById(field.typeData.toString());
                    if (pTypeData) {
                        operatorFound = pTypeData.operators.find(operator => {
                            return operator.toString() === condition.operator.toString();
                        });
                    }

                    let conditionValid = false;

                    let valueData = null;
                    if (stepActive.data) {
                        valueData = stepActive.data[field.field];
                    }

                    if (operatorFound && valueData) {
                        switch (field.typeData.toString()) {
                            case PTypeDataBusiness.TYPE_DATA_TEXT:
                                conditionValid = await PTypeDataBusiness.isValidConditionTypeDataText(condition.operator,
                                    valueData, condition.value);
                                break;
                            case PTypeDataBusiness.TYPE_DATA_NUMBER:
                                conditionValid = await PTypeDataBusiness.isValidConditionTypeDataNumeric(condition.operator,
                                    valueData, condition.value);
                                break;
                            case PTypeDataBusiness.TYPE_DATA_EMAIL:
                                conditionValid = await PTypeDataBusiness.isValidConditionTypeDataEmail(condition.operator,
                                    valueData, condition.value);
                                break;
                            case PTypeDataBusiness.TYPE_DATA_PHONE_NUMBER:
                                conditionValid = await PTypeDataBusiness.isValidConditionTypeDataPhoneNumber(condition.operator,
                                    valueData, condition.value);
                                break;
                            case PTypeDataBusiness.TYPE_DATA_DATE:
                                conditionValid = await PTypeDataBusiness.isValidConditionTypeDataDate(condition.operator,
                                    valueData, condition.value);
                                break;
                            case PTypeDataBusiness.TYPE_DATA_SINGLE_RESPONSE_LIST:
                                conditionValid = await PTypeDataBusiness.isValidConditionTypeDataSingleResponseList(condition.operator,
                                    valueData, condition.value);
                                break;
                            case PTypeDataBusiness.TYPE_DATA_MULTIPLE_RESPONSE_LIST:
                                conditionValid = await PTypeDataBusiness.isValidConditionTypeDataMultipleResponseList(condition.operator,
                                    valueData, condition.value);
                                break;
                            case PTypeDataBusiness.TYPE_DATA_CHECKBOX:
                                conditionValid = await PTypeDataBusiness.isValidConditionTypeDataCheckbox(condition.operator,
                                    valueData, condition.value);
                                break;
                            case PTypeDataBusiness.TYPE_DATA_FILE:
                                conditionValid = await PTypeDataBusiness.isValidConditionTypeDataFile(condition.operator,
                                    valueData, condition.value);
                                break;
                            case PTypeDataBusiness.TYPE_DATA_TEXTAREA:
                                conditionValid = await PTypeDataBusiness.isValidConditionTypeDataTextArea(condition.operator,
                                    valueData, condition.value);
                                break;
                            case PTypeDataBusiness.TYPE_DATA_URL:
                                conditionValid = await PTypeDataBusiness.isValidConditionTypeDataUrl(condition.operator,
                                    valueData, condition.value);
                                break;
                            default:
                                conditionValid = false;
                                break;
                        }
                    }

                    if (conditionValid) {
                        conditionsValid++;
                    }
                }

                if (conditionsValid === conditions.length) {

                    const callbacks = rule.callbacks;

                    for (let i = 0; i < callbacks.length; i++) {
                        const callback = callbacks[i];

                        switch (callback.callback.toString()) {
                            case PCallbackBusiness.CALLBACK_STEP:
                                await this.updateStepActive(rProcessId, callback.metadata.step);
                                break;
                            case PCallbackBusiness.CALLBACK_CLOSING:
                                await this.updateProcessActive(rProcessId, false);
                                isOver = true;
                                break;
                            case PCallbackBusiness.CALLBACK_EMAIL:

                                break;
                            case PCallbackBusiness.CALLBACK_SMS:

                                break;
                            default:

                                break;
                        }

                    }


                }


            }

        }

        return isOver;
    }



}