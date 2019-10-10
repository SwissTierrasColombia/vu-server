export default (VUMunicipalityModel) => {

    // Statics
    VUMunicipalityModel.statics = {

        async getMunicipalitiesByDepartment(departmentId) {
            return await this.find({ department: departmentId });
        },

        async getMunicipalityById(municipalityId) {
            return await this.findById(municipalityId);
        }

    };

};