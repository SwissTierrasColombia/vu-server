// Models
import MProcessModel from '../../../models/m.process.model';

export default class ProcessBusiness {

    static async createProcess(name, description) {
        return await MProcessModel.createProcess(name, description);
    }

    static async getAllProcesses() {
        return await MProcessModel.getProcesses();
    }

    static async getProcessById(processId) {
        try {
            return await MProcessModel.getProcessById(processId);
        } catch (e) {
            return null;
        }
    }

    static async removeProcessById(processId) {
        try {
            return await MProcessModel.removeProcessById(processId);
        } catch (e) {
            return null;
        }
    }

    static async updateProcess(processId, processName, processDescription) {
        return await MProcessModel.updateProcess(processId, processName, processDescription);
    }

    static async updateActiveProcess(processId, active) {
        return await MProcessModel.updateActiveProcess(processId, active);
    }

}