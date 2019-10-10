// Models
import VUMunicipalityModel from '../../../models/vu.municipality.model';

export default class MunicipalityBusiness {

    static MUNICIPALITY_CANUTALITO = '5d9cc532ce697a68e68b64dc';
    static MUNICIPALITY_OVEJAS = '5d9cc53b07ec6ed31137ca3e';

    static async getMunicipalitiesByDepartment(departmentId) {
        return await VUMunicipalityModel.getMunicipalitiesByDepartment(departmentId);
    }

    static async getMunicipalityById(municipalityId) {
        try {
            return await VUMunicipalityModel.getMunicipalityById(municipalityId);
        } catch (error) {
            return null;
        }
    }

    static async getVersionToUse(municipality) {
        const versions = municipality.versions;
        versions.sort(function (a, b) {
            return b.order - a.order;
        });
        return versions[0];
    }


}