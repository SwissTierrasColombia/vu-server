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

