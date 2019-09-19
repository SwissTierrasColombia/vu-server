// Business
import StepBusiness from './step.business';

export default class StepImplementation extends StepBusiness {

    constructor() {
        super();
    }

    static async getSteps() {
        return await this.getAllSteps();
    }


}