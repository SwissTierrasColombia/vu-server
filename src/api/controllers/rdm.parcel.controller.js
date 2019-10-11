// Libs
import { result, error, badRequest } from 'express-easy-helper';
import { getMessage } from '../../lib/helpers/locales';
import validator from 'validator';

// Business
import ParcelImplementation from '../business/rdm/parcel/parcel.implementation';

// Transformers


// get info parcel
export async function getInfoParcel(req, res) {

    const language = 'es';

    try {

        // data input
        const nupre = req.swagger.params.nupre.value;
        const cadastralCode = req.swagger.params.cadastralCode.value;
        const fmi = req.swagger.params.fmi.value;
        const municipalityId = req.swagger.params.municipality.value;

        // validate municipality
        req.checkQuery("municipality", getMessage('vu.municipalities.municipality_required', language)).notEmpty();
        req.checkQuery("municipality", getMessage('vu.municipalities.municipality_invalid', language)).isMongoId();

        const errors = req.validationErrors();
        if (errors) {
            return badRequest(res, 400, { message: errors[0].msg });
        }

        let dataParcel = await ParcelImplementation.iGetParcelBasicInformation(municipalityId, nupre, cadastralCode, fmi);

        return result(res, 200, dataParcel);
    } catch (exception) {
        console.log("rmd.parcel@getInfoParcel ---->", exception);
        if (exception.codeHttp && exception.key) {
            return error(res, exception.codeHttp, { message: getMessage(exception.key, 'es') });
        }
        return error(res, 500, { message: 'Server error ...' });
    }

}

// get info geometry parcel
export async function getInfoGeometryParcel(req, res) {

    const language = 'es';

    try {

        // data input
        const parcelId = req.swagger.params.parcelId.value;
        const municipalityId = req.swagger.params.municipality.value;

        // validate parcel id
        req.checkQuery("parcelId", getMessage('vu.parcels.parcel_required', language)).notEmpty();

        // validate municipality
        req.checkQuery("municipality", getMessage('vu.municipalities.municipality_required', language)).notEmpty();
        req.checkQuery("municipality", getMessage('vu.municipalities.municipality_invalid', language)).isMongoId();

        const errors = req.validationErrors();
        if (errors) {
            return badRequest(res, 400, { message: errors[0].msg });
        }

        let dataParcel = await ParcelImplementation.iGetParcelGeometryInformation(municipalityId, parcelId);

        return result(res, 200, dataParcel);
    } catch (exception) {
        console.log("rmd.parcel@getInfoGeometryParcel ---->", exception);
        if (exception.codeHttp && exception.key) {
            return error(res, exception.codeHttp, { message: getMessage(exception.key, 'es') });
        }
        return error(res, 500, { message: 'Server error ...' });
    }

}

// get image geometry parcel
export async function getImageGeometryParcel(req, res) {

    const language = 'es';

    try {

        // data input
        const parcelId = req.swagger.params.parcelId.value;
        const municipalityId = req.swagger.params.municipality.value;

        // validate parcel id
        req.checkQuery("parcelId", getMessage('vu.parcels.parcel_required', language)).notEmpty();

        // validate municipality
        req.checkQuery("municipality", getMessage('vu.municipalities.municipality_required', language)).notEmpty();
        req.checkQuery("municipality", getMessage('vu.municipalities.municipality_invalid', language)).isMongoId();

        const errors = req.validationErrors();
        if (errors) {
            return badRequest(res, 400, { message: errors[0].msg });
        }

        const dataImage = await ParcelImplementation.iGetImageGeometryParcel(municipalityId, parcelId);
        const image = new Buffer.from(dataImage, 'base64');

        res.writeHead(200, { 'Content-Type': 'image/png', 'Content-Length': image.length });
        res.end(image);
    } catch (exception) {
        console.log("rmd.parcel@getImageGeometryParcel ---->", exception);
        if (exception.codeHttp && exception.key) {
            return error(res, exception.codeHttp, { message: getMessage(exception.key, 'es') });
        }
        return error(res, 500, { message: 'Server error ...' });
    }

}

// get geometry terrain
export async function getGeometryTerrain(req, res) {

    const language = 'es';

    try {

        // data input
        const terrainId = req.swagger.params.terrainId.value;
        const municipalityId = req.swagger.params.municipality.value;

        // validate terrain id
        req.checkQuery("terrainId", getMessage('vu.parcels.terrain_required', language)).notEmpty();

        // validate municipality
        req.checkQuery("municipality", getMessage('vu.municipalities.municipality_required', language)).notEmpty();
        req.checkQuery("municipality", getMessage('vu.municipalities.municipality_invalid', language)).isMongoId();

        const errors = req.validationErrors();
        if (errors) {
            return badRequest(res, 400, { message: errors[0].msg });
        }

        const geometry = await ParcelImplementation.iGetGeometryTerrain(municipalityId, terrainId);

        return result(res, 200, geometry);
    } catch (exception) {
        console.log("rmd.parcel@getGeometryTerrain ---->", exception);
        if (exception.codeHttp && exception.key) {
            return error(res, exception.codeHttp, { message: getMessage(exception.key, 'es') });
        }
        return error(res, 500, { message: 'Server error ...' });
    }

}

// get information economic parcel
export async function getInfoEconomicParcel(req, res) {

    const language = 'es';

    try {

        // data input
        const cadastralCode = req.swagger.params.cadastralCode.value;
        const fmi = req.swagger.params.fmi.value;
        const nupre = req.swagger.params.nupre.value;
        const municipalityId = req.swagger.params.municipality.value;

        // validate municipality
        req.checkQuery("municipality", getMessage('vu.municipalities.municipality_required', language)).notEmpty();
        req.checkQuery("municipality", getMessage('vu.municipalities.municipality_invalid', language)).isMongoId();

        const errors = req.validationErrors();
        if (errors) {
            return badRequest(res, 400, { message: errors[0].msg });
        }

        const informationEconomic = await ParcelImplementation.iGetParcelEconomicInformation(municipalityId, cadastralCode, fmi, nupre);

        return result(res, 200, informationEconomic);
    } catch (exception) {
        console.log("rmd.parcel@getInfoEconomicParcel ---->", exception);
        if (exception.codeHttp && exception.key) {
            return error(res, exception.codeHttp, { message: getMessage(exception.key, 'es') });
        }
        return error(res, 500, { message: 'Server error ...' });
    }

}

// get information legal parcel
export async function getInfoLegalParcel(req, res) {

    const language = 'es';

    try {

        // data input
        const cadastralCode = req.swagger.params.cadastralCode.value;
        const fmi = req.swagger.params.fmi.value;
        const nupre = req.swagger.params.nupre.value;
        const municipalityId = req.swagger.params.municipality.value;

        // validate municipality
        req.checkQuery("municipality", getMessage('vu.municipalities.municipality_required', language)).notEmpty();
        req.checkQuery("municipality", getMessage('vu.municipalities.municipality_invalid', language)).isMongoId();

        const errors = req.validationErrors();
        if (errors) {
            return badRequest(res, 400, { message: errors[0].msg });
        }

        const informationLegal = await ParcelImplementation.iGetParcelLegalInformation(municipalityId, cadastralCode, fmi, nupre);

        return result(res, 200, informationLegal);
    } catch (exception) {
        console.log("rmd.parcel@getInfoLegalParcel ---->", exception);
        if (exception.codeHttp && exception.key) {
            return error(res, exception.codeHttp, { message: getMessage(exception.key, 'es') });
        }
        return error(res, 500, { message: 'Server error ...' });
    }

}

// get information physical parcel
export async function getInfoPhysicalParcel(req, res) {

    const language = 'es';

    try {

        // data input
        const cadastralCode = req.swagger.params.cadastralCode.value;
        const fmi = req.swagger.params.fmi.value;
        const nupre = req.swagger.params.nupre.value;
        const municipalityId = req.swagger.params.municipality.value;

        // validate municipality
        req.checkQuery("municipality", getMessage('vu.municipalities.municipality_required', language)).notEmpty();
        req.checkQuery("municipality", getMessage('vu.municipalities.municipality_invalid', language)).isMongoId();

        const errors = req.validationErrors();
        if (errors) {
            return badRequest(res, 400, { message: errors[0].msg });
        }

        const informationPhysical = await ParcelImplementation.iGetParcelPhysicalInformation(municipalityId, cadastralCode, fmi, nupre);

        return result(res, 200, informationPhysical);
    } catch (exception) {
        console.log("rmd.parcel@getInfoPhysicalParcel ---->", exception);
        if (exception.codeHttp && exception.key) {
            return error(res, exception.codeHttp, { message: getMessage(exception.key, 'es') });
        }
        return error(res, 500, { message: 'Server error ...' });
    }

}

// get information igac parcel
export async function getInfoIgacParcel(req, res) {

    const language = 'es';

    try {

        // data input
        const cadastralCode = req.swagger.params.cadastralCode.value;
        const fmi = req.swagger.params.fmi.value;
        const nupre = req.swagger.params.nupre.value;
        const municipalityId = req.swagger.params.municipality.value;

        // validate municipality
        req.checkQuery("municipality", getMessage('vu.municipalities.municipality_required', language)).notEmpty();
        req.checkQuery("municipality", getMessage('vu.municipalities.municipality_invalid', language)).isMongoId();

        const errors = req.validationErrors();
        if (errors) {
            return badRequest(res, 400, { message: errors[0].msg });
        }

        const informationIgac = await ParcelImplementation.iGetParcelIgacInformation(municipalityId, cadastralCode, fmi, nupre);

        return result(res, 200, informationIgac);
    } catch (exception) {
        console.log("rmd.parcel@getInfoIgacParcel ---->", exception);
        if (exception.codeHttp && exception.key) {
            return error(res, exception.codeHttp, { message: getMessage(exception.key, 'es') });
        }
        return error(res, 500, { message: 'Server error ...' });
    }

}

// get information party parcel
export async function getInfoPartyParcel(req, res) {

    const language = 'es';

    try {

        // data input
        const cadastralCode = req.swagger.params.cadastralCode.value;
        const fmi = req.swagger.params.fmi.value;
        const nupre = req.swagger.params.nupre.value;
        const municipalityId = req.swagger.params.municipality.value;

        // validate municipality
        req.checkQuery("municipality", getMessage('vu.municipalities.municipality_required', language)).notEmpty();
        req.checkQuery("municipality", getMessage('vu.municipalities.municipality_invalid', language)).isMongoId();

        const errors = req.validationErrors();
        if (errors) {
            return badRequest(res, 400, { message: errors[0].msg });
        }

        const informationParty = await ParcelImplementation.iGetParcelPartyInformation(municipalityId, cadastralCode, fmi, nupre);

        return result(res, 200, informationParty);
    } catch (exception) {
        console.log("rmd.parcel@getInfoPartyParcel ---->", exception);
        if (exception.codeHttp && exception.key) {
            return error(res, exception.codeHttp, { message: getMessage(exception.key, 'es') });
        }
        return error(res, 500, { message: 'Server error ...' });
    }

}

// get information affections parcel
export async function getInfoAffectionsParcel(req, res) {

    const language = 'es';

    try {

        // data input
        const terrainId = req.swagger.params.terrainId.value;
        const municipalityId = req.swagger.params.municipality.value;

        // validate municipality
        req.checkQuery("municipality", getMessage('vu.municipalities.municipality_required', language)).notEmpty();
        req.checkQuery("municipality", getMessage('vu.municipalities.municipality_invalid', language)).isMongoId();

        const errors = req.validationErrors();
        if (errors) {
            return badRequest(res, 400, { message: errors[0].msg });
        }

        await ParcelImplementation.iGetAffectations(municipalityId, terrainId);

        return result(res, 200, {});
    } catch (exception) {
        console.log("rmd.parcel@getInfoPartyParcel ---->", exception);
        if (exception.codeHttp && exception.key) {
            return error(res, exception.codeHttp, { message: getMessage(exception.key, 'es') });
        }
        return error(res, 500, { message: 'Server error ...' });
    }

}

// get information catastral parcel
export async function getInfoCatastralParcel(req, res) {

    const language = 'es';

    try {

        // data input
        const terrainId = req.swagger.params.terrainId.value;
        const municipalityId = req.swagger.params.municipality.value;

        // validate municipality
        req.checkQuery("municipality", getMessage('vu.municipalities.municipality_required', language)).notEmpty();
        req.checkQuery("municipality", getMessage('vu.municipalities.municipality_invalid', language)).isMongoId();

        const errors = req.validationErrors();
        if (errors) {
            return badRequest(res, 400, { message: errors[0].msg });
        }

        const informationCatastral = await ParcelImplementation.iGetParcelCatastralCodeInformation(municipalityId, terrainId);

        return result(res, 200, informationCatastral);
    } catch (exception) {
        console.log("rmd.parcel@getInfoCatastralParcel ---->", exception);
        if (exception.codeHttp && exception.key) {
            return error(res, exception.codeHttp, { message: getMessage(exception.key, 'es') });
        }
        return error(res, 500, { message: 'Server error ...' });
    }

}