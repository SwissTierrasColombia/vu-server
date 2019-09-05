

export default (MProcessModel) => {

    // Statics
    MProcessModel.statics = {

        async createProcess(name, description, vuUserId) {
            const MProcessModel = this;
            const process = new MProcessModel({
                process: name,
                description,
                createdBy: vuUserId
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

        async updateActiveProcess(processId, active) {
            let process = await this.findById(processId);
            process.active = active;
            return await process.save();
        },

        async getProcessesByActive(active) {
            return await this.find({ active });
        },

        async updateEntities(processId, entities) {
            let process = await this.findById(processId);
            process.entities = entities;
            return await process.save();
        }

    };

};