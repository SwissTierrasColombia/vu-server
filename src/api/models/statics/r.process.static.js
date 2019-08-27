// Libs
import { addPopulates } from '../../../lib/helpers/mongoose';
import moment from 'moment';

export default (RProcessModel) => {

    // Statics
    RProcessModel.statics = {

        async saveInformationStep(mProcessId, mStepId, data) {
            const RProcessModel = this;
            const process = new RProcessModel({
                process: mProcessId,
                step: mStepId,
                data
            });
            return await process.save();
        },

        async getInformationByProcessAndStep(mProcessId, mStepId, populates) {
            let data = this.findOne({ process: mProcessId, step: mStepId });
            data = addPopulates(data, populates);
            return await data.exec();
        },

        async updateInformationStep(mProcessId, mStepId, data, metadata) {
            let record = await this.findOne({ process: mProcessId, step: mStepId });
            record.data = data;
            record.metadata = metadata;
            record.updatedAt = moment();
            return await record.save();
        },

        async getDataByProcessId(mProcessId, populates) {
            let data = this.find({ process: mProcessId });
            data = addPopulates(data, populates);
            return await data.exec();
        }

    };

};