

export default (MProcessModel) => {

    // Statics
    MProcessModel.statics = {

        async createProcess(name, description) {
            const MProcessModel = this;
            const process = new MProcessModel({
                process: name,
                description,
            });
            return await process.save();
        },

        async getProcesses() {
            return await this.find();
        },

        async getProcessById(processId) {
            return await this.findById(processId);
        },

        async removeProcessById(processId) {
            return await this.remove({ _id: processId });
        },

        async updateProcess(processId, processName, processDescription) {
            let process = await this.findById(processId);
            process.process = processName;
            process.description = processDescription;
            return await process.save();
        },

    };

};