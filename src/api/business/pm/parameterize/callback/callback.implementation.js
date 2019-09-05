// Business
import CallbackBusiness from './callback.business';

export default class CallbackImplementation extends CallbackBusiness {

    constructor() {
        super();
    }

    static async getTypeCallbacks() {
        const populates = ['fields.typeData'];
        return await this.getCallbacks(populates);
    }

}