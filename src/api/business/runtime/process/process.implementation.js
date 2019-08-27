// Libs

// Business
import RProcessBusiness from './process.business';
import MProcessBusiness from '../../manage/process/process.business';
import MStepBusiness from '../../manage/step/step.business';
import MFieldBusiness from '../../manage/field/field.business';

// Exceptions
import APIException from '../../../exceptions/api.exception';

export default class ProcessImplementation extends RProcessBusiness {

    constructor() {
        super();
    }

    static async iSaveInformationStep(mProcessId, mStepId, data, metadata) {

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
        mFields.forEach(mField => {
            if (!mField.isPrivate) {
                if (mField.isRequired && !data.hasOwnProperty(mField.field)) {
                    errorField = true;
                }
            }
        });
        if (errorField) {
            throw new APIException('r.process.data_invalid', 401);
        }

        // verify if the data is new or update
        let dataSave = await this.getInformationByProcessAndStep(mProcessId, mStepId);
        if (dataSave) {
            await this.updateInformationStep(mProcessId, mStepId, data, metadata);
        } else {
            await this.saveInformationStep(mProcessId, mStepId, data);
        }

        return await this.getInformationByProcessAndStep(mProcessId, mStepId, ['process', 'step']);
    }

    static async iGetInformationProcess(mProcessId) {

        // verify if the process exists
        const processFound = await MProcessBusiness.getProcessById(mProcessId);
        if (!processFound) {
            throw new APIException('m.process.process_not_exists', 404);
        }

        return await this.getDataByProcessId(mProcessId, ['process', 'step']);
    }


}