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

    static async getGeometryTerrain(dataConnection, terrainId) {
        return await ParcelModel.getGeometryTerrain(dataConnection, terrainId);
    }

    static async getParcelEconomicInformation(dataConnection, plot_t_id, parcel_fmi, parcel_number, previous_parcel_number, property_record_card_model, valuation_model) {
        return await ParcelModel.getParcelEconomicInformation(dataConnection, plot_t_id, parcel_fmi, parcel_number, previous_parcel_number, property_record_card_model, valuation_model);
    }

    static async getParcelLegalInformation(dataConnection, plot_t_id, parcel_fmi, parcel_number, previous_parcel_number) {
        return await ParcelModel.getParcelLegalInformation(dataConnection, plot_t_id, parcel_fmi, parcel_number, previous_parcel_number);
    }

    static async getParcelPhysicalInformation(dataConnection, plot_t_id, parcel_fmi, parcel_number, previous_parcel_number, valuation_model) {
        return await ParcelModel.getParcelPhysicalInformation(dataConnection, plot_t_id, parcel_fmi, parcel_number, previous_parcel_number, valuation_model);
    }

    static async getParcelIgacInformation(dataConnection, plot_t_id, parcel_fmi, parcel_number, previous_parcel_number, property_record_card_model) {
        return await ParcelModel.getParcelIgacInformation(dataConnection, plot_t_id, parcel_fmi, parcel_number, previous_parcel_number, property_record_card_model);
    }

    static async getParcelPartyInformation(dataConnection, parcel_fmi, parcel_number, nupre) {
        return await ParcelModel.getParcelPartyInformation(dataConnection, parcel_fmi, parcel_number, nupre);
    }

    static async getParcelCatastralCodeInformation(dataConnection, terrainId) {
        return await ParcelModel.getParcelCatastralCodeInformation(dataConnection, terrainId);
    }

}