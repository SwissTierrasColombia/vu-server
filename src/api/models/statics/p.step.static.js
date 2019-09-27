

export default (PStepModel) => {

    // Statics
    PStepModel.statics = {

        async getSteps() {
            return await this.find();
        },

        async getStepById(pStepId) {
            return await this.findById(pStepId);
        }

    };

};