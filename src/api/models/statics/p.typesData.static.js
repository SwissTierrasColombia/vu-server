

export default (PTypesDataModel) => {

    // Statics
    PTypesDataModel.statics = {

        async getTypesData() {
            return await this.find();
        }

    }

};