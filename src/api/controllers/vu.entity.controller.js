// Libs
import { result, error, badRequest } from 'express-easy-helper';
import { getMessage } from '../../lib/helpers/locales';
import validator from 'validator';

// Business
import EntityImplementation from '../business/vu/entity/entity.implementation';

// Transformers
import { vuEntityTransformer } from '../transformers/vu.entity.transformer';

// get entities
export async function getEntities(req, res) {

    try {
        const entities = await EntityImplementation.iGetEntities();
        return result(res, 200, vuEntityTransformer.transformer(entities));
    } catch (exception) {
        console.log("vu.entity@getEntities ---->", exception);
        if (exception.codeHttp && exception.key) {
            return error(res, exception.codeHttp, { message: getMessage(exception.key, 'es') });
        }
        return error(res, 500, { message: 'Server error ...' });
    }

}

// get entities
export async function createEntity(req, res) {

    const language = 'es';

    try {

        // validate entity name
        req.checkBody("entity", getMessage('vu.entities.entity_name_required', language)).notEmpty();

        const errors = req.validationErrors();
        if (errors) {
            return badRequest(res, 400, { message: errors[0].msg });
        }

        const entityName = req.body.entity.trim();

        const entity = await EntityImplementation.iCreateEntity(entityName);
        return result(res, 200, vuEntityTransformer.transformer(entity));
    } catch (exception) {
        console.log("vu.entity@createEntity ---->", exception);
        if (exception.codeHttp && exception.key) {
            return error(res, exception.codeHttp, { message: getMessage(exception.key, 'es') });
        }
        return error(res, 500, { message: 'Server error ...' });
    }

}

// get entity
export async function getEntity(req, res) {

    const language = 'es';

    try {

        // validate entity / id
        req.check('entity', getMessage('vu.entities.entity_required', language)).custom((value) => {
            return !validator.isEmpty(req.swagger.params.entity.value);
        });
        req.check('entity', getMessage('vu.entities.entity_invalid', language)).custom((value) => {
            return validator.isMongoId(req.swagger.params.entity.value);
        });

        const errors = req.validationErrors();
        if (errors) {
            return badRequest(res, 400, { message: errors[0].msg });
        }

        const entityId = req.swagger.params.entity.value;

        const entity = await EntityImplementation.iGetEntity(entityId);
        return result(res, 200, vuEntityTransformer.transformer(entity));
    } catch (exception) {
        console.log("vu.entity@getEntity ---->", exception);
        if (exception.codeHttp && exception.key) {
            return error(res, exception.codeHttp, { message: getMessage(exception.key, 'es') });
        }
        return error(res, 500, { message: 'Server error ...' });
    }

}

// update entity
export async function updateEntity(req, res) {

    const language = 'es';

    try {

        // validate entity / id
        req.check('entity', getMessage('vu.entities.entity_required', language)).custom((value) => {
            return !validator.isEmpty(req.swagger.params.entity.value);
        });
        req.check('entity', getMessage('vu.entities.entity_invalid', language)).custom((value) => {
            return validator.isMongoId(req.swagger.params.entity.value);
        });

        // validate entity name
        req.checkBody("name", getMessage('vu.entities.entity_name_required', language)).notEmpty();

        const errors = req.validationErrors();
        if (errors) {
            return badRequest(res, 400, { message: errors[0].msg });
        }

        const entityId = req.swagger.params.entity.value;
        const entityName = req.body.name.trim();

        const entity = await EntityImplementation.iUpdateEntity(entityId, entityName);
        return result(res, 200, vuEntityTransformer.transformer(entity));
    } catch (exception) {
        console.log("vu.entity@updateEntity ---->", exception);
        if (exception.codeHttp && exception.key) {
            return error(res, exception.codeHttp, { message: getMessage(exception.key, 'es') });
        }
        return error(res, 500, { message: 'Server error ...' });
    }

}