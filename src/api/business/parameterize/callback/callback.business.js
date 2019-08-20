// Models
import PCallbackModel from '../../../models/p.callback.model';

export default class CallbackBusiness {

    static async getCallbacks(populates) {
        return await PCallbackModel.getCallbacks(populates);
    }

    static async getCallbackById(callbackId, populates) {
        try {
            return await PCallbackModel.getCallbackById(callbackId, populates);
        } catch (error) {
            return null;
        }
    }

}