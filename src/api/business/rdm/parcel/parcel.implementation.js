// Libs
import config from '../../../../config';
import image2base64 from 'image-to-base64';

// Business
import ParcelBusiness from './parcel.business';
import MunicipalityBusiness from '../../vu/municipality/municipality.business';

// Exceptions
import APIException from '../../../exceptions/api.exception';

export default class ParcelImplementation extends ParcelBusiness {

    constructor() {
        super();
    }

    static async iGetParcelBasicInformation(municipalityId, nupre, catastralCode, fmi) {

        const municipalityFound = await MunicipalityBusiness.getMunicipalityById(municipalityId);
        if (!municipalityFound) {
            throw new APIException('vu.municipalities.municipality_not_exits', 404);
        }

        const versions = municipalityFound.versions;
        if (versions.length === 0) {
            throw new APIException('vu.municipalities.municipality_not_information_available', 401);
        }

        const version = await MunicipalityBusiness.getVersionToUse(municipalityFound);

        const informationParcel = await this.getParcelBasicInformation(version.connection, null, fmi, catastralCode, null, false, false);
        if (!informationParcel) {
            throw new APIException('vu.parcels.parcel_not_found', 404);
        }

        return informationParcel;
    }

    static async iGetParcelGeometryInformation(municipalityId, parcelId) {

        const municipalityFound = await MunicipalityBusiness.getMunicipalityById(municipalityId);
        if (!municipalityFound) {
            throw new APIException('vu.municipalities.municipality_not_exits', 404);
        }

        const versions = municipalityFound.versions;
        if (versions.length === 0) {
            throw new APIException('vu.municipalities.municipality_not_information_available', 401);
        }

        const version = await MunicipalityBusiness.getVersionToUse(municipalityFound);

        const informationParcel = await this.getParcelGeometryInformation(version.connection, parcelId);
        if (!informationParcel) {
            throw new APIException('vu.parcels.parcel_not_found', 404);
        }

        return informationParcel;
    }

    static async iGetImageGeometryParcel(municipalityId, parcelId) {

        let imageBase64 = null;

        const municipalityFound = await MunicipalityBusiness.getMunicipalityById(municipalityId);
        if (!municipalityFound) {
            throw new APIException('vu.municipalities.municipality_not_exits', 404);
        }

        const versions = municipalityFound.versions;
        if (versions.length === 0) {
            throw new APIException('vu.municipalities.municipality_not_information_available', 401);
        }

        const version = await MunicipalityBusiness.getVersionToUse(municipalityFound);

        const dataSizes = await this.getParcelSizes(version.connection, parcelId);
        if (!dataSizes) {
            throw new APIException('vu.parcels.parcel_not_found', 404);
        }

        const padding = 20;
        let xmin = dataSizes.xmin - padding;
        let ymin = dataSizes.ymin - padding;
        let xmax = dataSizes.xmax + padding;
        let ymax = dataSizes.ymax + padding;
        const x = xmax - xmin;
        const y = ymax - ymin;
        if (x > y) {
            ymin -= (x - y) / 2;
            ymax += (x - y) / 2;
        } else if (y > x) {
            xmin -= (y - x) / 2;
            xmax += (y - x) / 2;
        }

        try {
            const cqlFilter = "(id=" + parcelId + " AND layer='parcel') OR (layer='context' AND id<>" + parcelId + ")";
            const bbox = xmin + "," + ymin + "," + xmax + "," + ymax;

            const url = `?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&FORMAT=image/png&TRANSPARENT=true&LAYERS=${version.layer}&SRS=${version.srs}&WIDTH=700&HEIGHT=700&BBOX=${bbox}&CQL_FILTER=${cqlFilter}`;

            imageBase64 = await image2base64(config.geoserver.urlWms + url);

        } catch (error) {
            imageBase64 = null;
        }


        return imageBase64;
    }

    static async iGetGeometryTerrain(municipalityId, terrainId) {

        const municipalityFound = await MunicipalityBusiness.getMunicipalityById(municipalityId);
        if (!municipalityFound) {
            throw new APIException('vu.municipalities.municipality_not_exits', 404);
        }

        const versions = municipalityFound.versions;
        if (versions.length === 0) {
            throw new APIException('vu.municipalities.municipality_not_information_available', 401);
        }

        const version = await MunicipalityBusiness.getVersionToUse(municipalityFound);

        const informationTerrain = await this.getGeometryTerrain(version.connection, terrainId);
        if (!informationTerrain) {
            throw new APIException('vu.parcels.parcel_not_found', 404);
        }

        return informationTerrain;
    }

    static async iGetParcelEconomicInformation(municipalityId, cadastralCode, fmi, nupre) {

        const municipalityFound = await MunicipalityBusiness.getMunicipalityById(municipalityId);
        if (!municipalityFound) {
            throw new APIException('vu.municipalities.municipality_not_exits', 404);
        }

        const versions = municipalityFound.versions;
        if (versions.length === 0) {
            throw new APIException('vu.municipalities.municipality_not_information_available', 401);
        }

        const version = await MunicipalityBusiness.getVersionToUse(municipalityFound);

        const informationEconomic = await this.getParcelEconomicInformation(version.connection, null, fmi, cadastralCode, null, true, true);
        if (!informationEconomic) {
            throw new APIException('vu.parcels.parcel_not_found', 404);
        }

        return informationEconomic;
    }

    static async iGetParcelLegalInformation(municipalityId, cadastralCode, fmi, nupre) {

        const municipalityFound = await MunicipalityBusiness.getMunicipalityById(municipalityId);
        if (!municipalityFound) {
            throw new APIException('vu.municipalities.municipality_not_exits', 404);
        }

        const versions = municipalityFound.versions;
        if (versions.length === 0) {
            throw new APIException('vu.municipalities.municipality_not_information_available', 401);
        }

        const version = await MunicipalityBusiness.getVersionToUse(municipalityFound);

        const informationLegal = await this.getParcelLegalInformation(version.connection, null, fmi, cadastralCode, null);
        if (!informationLegal) {
            throw new APIException('vu.parcels.parcel_not_found', 404);
        }

        return informationLegal;
    }

    static async iGetParcelPhysicalInformation(municipalityId, cadastralCode, fmi, nupre) {

        const municipalityFound = await MunicipalityBusiness.getMunicipalityById(municipalityId);
        if (!municipalityFound) {
            throw new APIException('vu.municipalities.municipality_not_exits', 404);
        }

        const versions = municipalityFound.versions;
        if (versions.length === 0) {
            throw new APIException('vu.municipalities.municipality_not_information_available', 401);
        }

        const version = await MunicipalityBusiness.getVersionToUse(municipalityFound);

        const informationPhysical = await this.getParcelPhysicalInformation(version.connection, null, fmi, cadastralCode, null, true);
        if (!informationPhysical) {
            throw new APIException('vu.parcels.parcel_not_found', 404);
        }

        return informationPhysical;
    }

    static async iGetParcelIgacInformation(municipalityId, cadastralCode, fmi, nupre) {

        const municipalityFound = await MunicipalityBusiness.getMunicipalityById(municipalityId);
        if (!municipalityFound) {
            throw new APIException('vu.municipalities.municipality_not_exits', 404);
        }

        const versions = municipalityFound.versions;
        if (versions.length === 0) {
            throw new APIException('vu.municipalities.municipality_not_information_available', 401);
        }

        const version = await MunicipalityBusiness.getVersionToUse(municipalityFound);

        const informationIgac = await this.getParcelIgacInformation(version.connection, null, fmi, cadastralCode, null, true);
        if (!informationIgac) {
            throw new APIException('vu.parcels.parcel_not_found', 404);
        }

        return informationIgac;
    }

    static async iGetParcelPartyInformation(municipalityId, cadastralCode, fmi, nupre) {

        const municipalityFound = await MunicipalityBusiness.getMunicipalityById(municipalityId);
        if (!municipalityFound) {
            throw new APIException('vu.municipalities.municipality_not_exits', 404);
        }

        const versions = municipalityFound.versions;
        if (versions.length === 0) {
            throw new APIException('vu.municipalities.municipality_not_information_available', 401);
        }

        const version = await MunicipalityBusiness.getVersionToUse(municipalityFound);

        const informationParty = await this.getParcelPartyInformation(version.connection, fmi, cadastralCode, nupre);

        return informationParty;
    }

    static async iGetAffectations(municipalityId, terrainId) {

        const municipalityFound = await MunicipalityBusiness.getMunicipalityById(municipalityId);
        if (!municipalityFound) {
            throw new APIException('vu.municipalities.municipality_not_exits', 404);
        }

        const versions = municipalityFound.versions;
        if (versions.length === 0) {
            throw new APIException('vu.municipalities.municipality_not_information_available', 401);
        }

        console.log('holaa');

    }

    static async iGetParcelCatastralCodeInformation(municipalityId, terrainId) {

        const municipalityFound = await MunicipalityBusiness.getMunicipalityById(municipalityId);
        if (!municipalityFound) {
            throw new APIException('vu.municipalities.municipality_not_exits', 404);
        }

        const versions = municipalityFound.versions;
        if (versions.length === 0) {
            throw new APIException('vu.municipalities.municipality_not_information_available', 401);
        }

        const version = await MunicipalityBusiness.getVersionToUse(municipalityFound);

        const informationCatastral = await this.getParcelCatastralCodeInformation(version.connection, terrainId);
        if (!informationCatastral) {
            throw new APIException('vu.parcels.parcel_not_found', 404);
        }

        return informationCatastral;
    }

    static async iGetParcelBasicInformationRecord(municipalityId, nupre, catastralCode, fmi) {

        const municipalityFound = await MunicipalityBusiness.getMunicipalityById(municipalityId);
        if (!municipalityFound) {
            throw new APIException('vu.municipalities.municipality_not_exits', 404);
        }

        const versions = municipalityFound.versions;
        if (versions.length === 0) {
            throw new APIException('vu.municipalities.municipality_not_information_available', 401);
        }

        let dataRecord = [];

        const version = await MunicipalityBusiness.getVersionToUse(municipalityFound);
        const codeBeforeVersion = version.order - 1;
        if (codeBeforeVersion > 0) {

            const beforeVersion = municipalityFound.versions.find(item => {
                return item.order === codeBeforeVersion;
            });

            dataRecord = await this.getParcelBasicInformation(beforeVersion.connection, null, fmi, catastralCode, null, false, false);
            if (!dataRecord) {
                dataRecord = [];
            }

        }

        return dataRecord;
    }


}