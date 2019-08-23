// Libs

// Business
import RProcessBusiness from './process.business';
import MProcessBusiness from '../../manage/process/process.business';
import MStepBusiness from '../../manage/step/step.business';

// Exceptions
import APIException from '../../../exceptions/api.exception';

export default class ProcessImplementation extends RProcessBusiness {

    constructor() {
        super();
    }

    static async saveInformationStep(mProcessId, mStepId, data) {

        // verify if the process exists
        const processFound = await MProcessBusiness.getProcessById(mProcessId);
        if (!processFound) {
            throw new APIException('m.process.process_not_exists', 404);
        }

        // verify if the process exists
        const stepFound = await MStepBusiness.getStepById(mStepId);
        if (!stepFound) {
            throw new APIException('m.process.steps.step_not_exists', 404);
        }



    }


}