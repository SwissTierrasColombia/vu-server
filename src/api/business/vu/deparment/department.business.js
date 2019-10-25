// Models
import VUDepartmentModel from '../../../models/vu.department.model';

export default class DepartmentBusiness {

    static DEPARMENT_SUCRE = '5d9cbb4af5817b954d913d97';

    static async getDepartments() {
        return await VUDepartmentModel.getDepartments();
    }

    static async getDepartmentById(departmentId) {
        try {
            return await VUDepartmentModel.getDepartmentById(departmentId);
        } catch (error) {
            return null;
        }
    }

}