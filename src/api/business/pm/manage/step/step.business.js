// Models
import MStepModel from '../../../../models/m.step.model';

export default class StepBusiness {

    static async getStepByTypeAndProcess(typeStepId, processId) {
        return await MStepModel.getStepByTypeAndProcess(typeStepId, processId);
    }

    static async createStep(typeStepId, processId) {
        return await MStepModel.createStep(typeStepId, processId);
    }

    static async getStepsFromProcess(processId, populates) {
        return await MStepModel.getStepsByProcess(processId, populates);
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

    static async updateRolesToStep(mStepId, roles) {
        return await MStepModel.updateRolesToStep(mStepId, roles);
    }

    static async getStepsByProcessAndRoles(mProcessId, roles) {
        return await MStepModel.getStepsByProcessAndRoles(mProcessId, roles);
    }

    static async updateStepRules(mStepId, rules) {
        return await MStepModel.updateStepRules(mStepId, rules);
    }

    static async updateStepFirst(mStepId, isFirst) {
        return await MStepModel.updateStepFirst(mStepId, isFirst);
    }

    static async getStepFirstFromProcess(mProcessId) {
        return await MStepModel.getStepFirstFromProcess(mProcessId);
    }

    static async updateEntityToStep(stepId, entityId) {
        return await MStepModel.updateEntityToStep(stepId, entityId);
    }

    static async getStepsMatchEntitiesAndRoles(processId, entitiesId, rolesId) {
        return await MStepModel.getStepsMatchEntitiesAndRoles(processId, entitiesId, rolesId);
    }

    static async updateRuleToStep(mStepId, ruleId, dataRule) {
        return await MStepModel.updateRuleToStep(mStepId, ruleId, dataRule);
    }

}