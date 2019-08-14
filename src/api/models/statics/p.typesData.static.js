

export default (PTypesDataModel) => {

    // Statics
    PTypesDataModel.statics = {

        async getTypesData() {
            return await this.find();
        },

        async getTypeDataById(typeDataId) {
            return await this.findById(typeDataId);
        },


    }

};