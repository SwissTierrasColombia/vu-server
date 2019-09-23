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

    static async updateStepActive(rProcessId, mStepId) {
        return await RProcessModel.updateStepActive(rProcessId, mStepId);
    }

    static async updateProcessActive(rProcessId, active) {
        return await RProcessModel.updateProcessActive(rProcessId, active);
    }

    static async getProcessesByProcess(mProcessId) {
        return await RProcessModel.getProcessesByProcess(mProcessId);
    }

    static async getProcessesByActive(active) {
        return await RProcessModel.getProcessesByActive(active);
    }

    static async getCountActiveProcessByTypeProcess(mProcessId, active) {
        return await RProcessModel.getCountActiveProcessByTypeProcess(mProcessId, active);
    }

    static async getCountProcessesByProcess(mProcessId) {
        return await RProcessModel.getCountProcessesByProcess(mProcessId);
    }

}