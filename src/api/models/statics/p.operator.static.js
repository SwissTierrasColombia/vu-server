

export default (POperatorModel) => {

    // Statics
    POperatorModel.statics = {

        async getOperators() {
            return await this.find();
        },

        async getOperatorById(operatorId) {
            return await this.findById(operatorId);
        },

    }

};