

export default (MRoleModel) => {

    // Statics
    MRoleModel.statics = {

        async getRoleByNameAndProcess(roleName, processId) {
            return await this.findOne({ role: roleName, process: processId });
        },

        async createRole(roleName, processId) {
            const MRoleModel = this;
            const role = new MRoleModel({
                role: roleName,
                process: processId
            });
            return await role.save();
        },

        async getRolesByProcess(processId) {
            return await this.find({ process: processId });
        },

        async getRoleById(roleId) {
            return await this.findById(roleId);
        },

        async updateRoleFromProcess(processId, roleId, roleName) {
            let role = await this.findOne({ _id: roleId, process: processId });
            role.role = roleName;
            return await role.save();
        },

        async removeRoleById(roleId) {
            return await this.remove({ _id: roleId });
        },

        async removeRolesByProcessId(processId) {
            return await this.remove({ process: processId });
        }

    };

};