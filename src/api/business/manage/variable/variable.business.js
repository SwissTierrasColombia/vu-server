// Models
import MVariableModel from '../../../models/m.variable.model';

export default class VariableBusiness {

    static async getVariableByNameAndProcess(name, mProcessId) {
        return await MVariableModel.getVariableByNameAndProcess(name, mProcessId);
    }

    static async createVariable(variableName, variableValue, processId) {
        return await MVariableModel.createVariable(variableName, variableValue, processId);
    }

    static async getVariablesByProcess(processId) {
        return await MVariableModel.getVariablesByProcess(processId);
    }

    static async getVariableById(variableId) {
        try {
            return await MVariableModel.getVariableById(variableId);
        } catch (error) {
            return null;
        }
    }

    static async updateVariable(variableId, variableName, variableValue) {
        return await MVariableModel.updateVariable(variableId, variableName, variableValue);
    }

    static async removeVariableById(variableId) {
        try {
            return MVariableModel.removeVariableById(variableId);
        } catch (error) {
            return null;
        }
    }

}