

export default (PStepModel) => {

    // Statics
    PStepModel.statics = {

        async getSteps() {
            return await this.find();
        }

    }

};