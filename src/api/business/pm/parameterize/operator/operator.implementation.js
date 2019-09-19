// Business
import OperatorBusiness from './operator.business';

export default class OperatorImplementation extends OperatorBusiness {

    constructor() {
        super();
    }

    static async getTypesOperator() {
        return await this.getOperators();
    }

}