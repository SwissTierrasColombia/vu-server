// Models
import MStepModel from '../../../models/m.step.model';

export default class StepBusiness {

    static async getStepByTypeAndProcess(typeStepId, processId) {
        return await MStepModel.getStepByTypeAndProcess(typeStepId, processId);
    }

    static async createStep(typeStepId, processId) {
        return await MStepModel.createStep(typeStepId, processId);
    }

    static async getStepsFromProcess(processId) {
        return await MStepModel.getStepsByProcess(processId);
    }

    static async getStepById(stepId) {
        try {
            return await MStepModel.getStepById(stepId);
        } catch (error) {
            return null;
        }
    }

    static async addRuleToStep(mStepId, rule) {
        return await MStepModel.addRuleToStep(mStepId, rule);
    }

    static async removeRuleToStep(mStepId, roleId) {
        return await MStepModel.removeRuleToStep(mStepId, roleId);
    }

    static async removeStepsByProcessId(processId) {
        try {
            return await MStepModel.removeStepsByProcessId(processId);
        } catch (error) {
            return null;
        }
    }

    static async removeStepById(mStepId) {
        try {
            return await MStepModel.removeStepById(mStepId);
        } catch (error) {
            return null;
        }
    }

}