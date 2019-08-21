

export default (MVariableModel) => {

    // Statics
    MVariableModel.statics = {

        async getVariableByNameAndProcess(name, processId) {
            return await this.findOne({ variable: name, process: processId });
        },

        async createVariable(variableName, variableValue, processId) {
            const MVariableModel = this;
            const variable = new MVariableModel({
                variable: variableName,
                value: variableValue,
                process: processId
            });
            return await variable.save();
        },

        async getVariablesByProcess(processId) {
            return await this.find({ process: processId });
        },

        async getVariableById(variableId) {
            return await this.findById(variableId);
        },

        async updateVariable(variableId, variableName, variableValue) {
            let variable = await this.findById(variableId);
            variable.variable = variableName;
            variable.value = variableValue;
            return await variable.save();
        },

        async removeVariableById(variableId) {
            return await this.remove({ _id: variableId });
        }

    }

};