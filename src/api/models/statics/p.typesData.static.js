

export default (PTypesDataModel) => {

    // Statics
    PTypesDataModel.statics = {

        async getTypesData() {
            let types = this.find().populate('operators');
            return await types.exec();
        },

        async getTypeDataById(typeDataId) {
            return await this.findById(typeDataId);
        },


    };

};