// Models
import RProcessModel from '../../../models/r.process.model';

export default class ProcessBusiness {

    static async saveInformationStep(mProcessId, mStepId, data) {
        return await RProcessModel.saveInformationStep(mProcessId, mStepId, data);
    }

    static async getInformationByProcessAndStep(mProcessId, mStepId, populates) {
        return await RProcessModel.getInformationByProcessAndStep(mProcessId, mStepId, populates);
    }

    static async updateInformationStep(mProcessId, mStepId, data, metadata) {
        return await RProcessModel.updateInformationStep(mProcessId, mStepId, data, metadata);
    }

    static async getDataByProcessId(mProcessId, populates) {
        return await RProcessModel.getDataByProcessId(mProcessId, populates);
    }

}