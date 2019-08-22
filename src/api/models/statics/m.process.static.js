

export default (MProcessModel) => {

    // Statics
    MProcessModel.statics = {

        async createProcess(name) {
            const MProcessModel = this;
            const process = new MProcessModel({
                process: name,
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

        async updateProcess(processId, processName) {
            let process = await this.findById(processId);
            process.process = processName;
            return await process.save();
        },

    };

};