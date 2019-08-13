

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

    }

};