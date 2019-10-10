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


}