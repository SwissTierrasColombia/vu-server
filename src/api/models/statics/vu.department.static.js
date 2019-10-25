export default (VUDepartmentModel) => {

    // Statics
    VUDepartmentModel.statics = {

        async getDepartments() {
            return await this.find();
        },

        async getDepartmentById(departmentId) {
            return await this.findById(departmentId);
        }

    };

};