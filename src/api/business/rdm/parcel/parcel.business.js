// Models
import ParcelModel from '../../../models-pg/parcel.model';

export default class ParcelBusiness {

    static async getParcelBasicInformation(dataConnection, plot_t_id, parcel_fmi, parcel_number, previous_parcel_number, property_record_card_model, valuation_model) {
        return await ParcelModel.getParcelBasicInformation(dataConnection, plot_t_id, parcel_fmi, parcel_number, previous_parcel_number, property_record_card_model, valuation_model);
    }

    static async getParcelGeometryInformation(dataConnection, parcelId) {
        return await ParcelModel.getParcelGeometryInformation(dataConnection, parcelId);
    }

    static async getParcelSizes(dataConnection, parcelId) {
        return await ParcelModel.getParcelSizes(dataConnection, parcelId);
    }

}