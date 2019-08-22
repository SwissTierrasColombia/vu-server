// Models
import MProcessModel from '../../../models/m.process.model';

export default class ProcessBusiness {

    static async createProcess(name) {
        return await MProcessModel.createProcess(name);
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

    static async updateProcess(processId, processName) {
        return await MProcessModel.updateProcess(processId, processName);
    }

}