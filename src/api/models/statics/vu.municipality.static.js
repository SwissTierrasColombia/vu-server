export default (VUMunicipalityModel) => {

    // Statics
    VUMunicipalityModel.statics = {

        async getMunicipalitiesByDepartment(departmentId) {
            return await this.find({ department: departmentId });
        }

    };

};