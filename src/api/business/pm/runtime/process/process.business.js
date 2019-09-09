// Models
import RProcessModel from '../../../../models/r.process.model';

export default class ProcessBusiness {

    static async getProcessById(rProcessId) {
        try {
            return await RProcessModel.getProcessById(rProcessId);
        } catch (error) {
            return null;
        }
    }

    static async createProcess(mProcessId, createdBy, mSteps) {
        return await RProcessModel.createProcess(mProcessId, createdBy, mSteps);
    }

    static async updateProcessStep(rProcessId, mStepId, data, metadata, vuUserId) {
        return await RProcessModel.updateProcessStep(rProcessId, mStepId, data, metadata, vuUserId);
    }

    static async getProcessesByProcessAndSteps(mProcessId, mRoles, populates) {
        return await RProcessModel.getProcessesByProcessAndSteps(mProcessId, mRoles, populates);
    }

    static async getProcessesMatchSteps(mProcessId, mStepsId) {
        return await RProcessModel.getProcessesMatchSteps(mProcessId, mStepsId);
    }

}