// Models
import PCallbackModel from '../../../../models/p.callback.model';

export default class CallbackBusiness {

    static CALLBACK_EMAIL = '5d5c1484d4302ab4ff21ecdd';
    static CALLBACK_SMS = '5d5c148a0a2eacc6f388b2a1';
    static CALLBACK_STEP = '5d5c149a82457777a6ad01c9';
    static CALLBACK_CLOSING = '5d7f9a1d44b81253a451ef87';

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