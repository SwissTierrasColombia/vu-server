

export default (MStepModel) => {

    // Statics
    MStepModel.statics = {

        async getStepByTypeAndProcess(typeStepId, processId) {
            return await this.findOne({ typeStep: typeStepId, process: processId });
        },

        async createStep(typeStepId, processId) {
            const MStepModel = this;
            const step = new MStepModel({
                typeStep: typeStepId,
                process: processId
            });
            return await step.save();
        },

        async getStepsByProcess(processId) {
            return await this.find({ process: processId });
        },

        async getStepById(stepId) {
            return await this.findById(stepId);
        },

    }

};