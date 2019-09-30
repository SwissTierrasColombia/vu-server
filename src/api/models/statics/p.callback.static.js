// Libs
import { addPopulates } from '../../../lib/helpers/mongoose';

export default (PCallbackModel) => {

    // Statics
    PCallbackModel.statics = {

        async getCallbacks(populates) {
            let callbacks = this.find();
            callbacks = addPopulates(callbacks, populates);
            return await callbacks.exec();
        },

        async getCallbackById(callbackId, populates) {
            let callback = this.findById(callbackId);
            callback = addPopulates(callback, populates);
            return await callback.exec();
        }

    };

};