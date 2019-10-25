// Business
import DeparmentBusiness from './department.business';
import MunicipalityBusiness from '../municipality/municipality.business';

// Exceptions
import APIException from '../../../exceptions/api.exception';

export default class DepartmentImplementation extends DeparmentBusiness {

    constructor() {
        super();
    }

    static async iGetDepartments() {
        return await this.getDepartments();
    }

    static async iGetMunicipalitiesByDepartment(departmentId) {

        const departmentFound = await this.getDepartmentById(departmentId);
        if (!departmentFound) {
            throw new APIException('vu.departments.department_not_exits', 404);
        }

        return await MunicipalityBusiness.getMunicipalitiesByDepartment(departmentId);
    }

}