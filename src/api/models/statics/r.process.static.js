// Libs
import { addPopulates } from '../../../lib/helpers/mongoose';
import moment from 'moment';

export default (RProcessModel) => {

    // Statics
    RProcessModel.statics = {

        async createProcess(mProcessId, mSteps) {
            const RProcessModel = this;
            const process = new RProcessModel({
                process: mProcessId,
                steps: mSteps
            });
            return await process.save();
        },

        async getProcessById(rProcessId) {
            return await this.findById(rProcessId);
        },

        async updateProcessStep(rProcessId, mStepId, data, metadata) {
            return await this.findOneAndUpdate(
                {
                    '_id': rProcessId,
                    'steps.step': mStepId
                },
                {
                    "$set": {
                        "steps.$.data": data,
                        "steps.$.metadata": metadata,
                        "steps.$.updatedAt": moment()
                    }
                }
            );
        },

        async getProcessesByProcessAndSteps(mProcessId, mRoles, populates) {
            let processes = this.find({
                process: mProcessId,
                'steps.step': { "$in": mRoles },
                'steps.active': true
            });
            processes = addPopulates(processes, populates);
            return await processes.exec();
        }

    };

};