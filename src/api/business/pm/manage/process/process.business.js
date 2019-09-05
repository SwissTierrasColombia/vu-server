// Models
import MProcessModel from '../../../../models/m.process.model';

// Business
import StepBusiness from '../step/step.business';
import PCallbackBusiness from '../../parameterize/callback/callback.business';

export default class ProcessBusiness {

    static async createProcess(name, description, vuUserId) {
        return await MProcessModel.createProcess(name, description, vuUserId);
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

    static async getProcessesAvailable() {
        return await MProcessModel.getProcessesByActive(true);
    }

    static async getFirstStepFromProcess(mProcessId) {

        const mSteps = await StepBusiness.getStepsFromProcess(mProcessId);
        for (let i in mSteps) {
            const mStepIdBase = mSteps[i]._id.toString();
            let myIdFound = false;


            for (let j in mSteps) {
                const mStepOther = mSteps[j];
                if (mStepOther._id.toString() !== mStepIdBase) {
                    const rules = mStepOther.rules;
                    for (let k = 0; k < rules.length; k++) {
                        const rule = rules[k];
                        const callbacks = rule.callbacks;
                        for (let l = 0; l < callbacks.length; l++) {
                            const callback = callbacks[l];
                            if (callback.callback.toString() === PCallbackBusiness.CALLBACK_STEP &&
                                callback.metadata.step.toString() === mStepIdBase) {
                                myIdFound = true;
                            }
                        }
                    }
                }
            }

            if (!myIdFound) {
                return mSteps[i];
            }
        }

    }

    static async updateEntities(processId, entities) {
        return await MProcessModel.updateEntities(processId, entities);
    }

}