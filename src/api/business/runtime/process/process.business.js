// Models
import RProcessModel from '../../../models/r.process.model';

export default class ProcessBusiness {

    static async getProcessById(rProcessId) {
        try {
            return await RProcessModel.getProcessById(rProcessId);
        } catch (error) {
            return null;
        }
    }

    static async createProcess(mProcessId, mSteps) {
        return await RProcessModel.createProcess(mProcessId, mSteps);
    }

    static async updateProcessStep(rProcessId, mStepId, data, metadata) {
        return await RProcessModel.updateProcessStep(rProcessId, mStepId, data, metadata);
    }

    static async getProcessesByProcessAndSteps(mProcessId, mRoles, populates) {
        return await RProcessModel.getProcessesByProcessAndSteps(mProcessId, mRoles, populates);
    }

}