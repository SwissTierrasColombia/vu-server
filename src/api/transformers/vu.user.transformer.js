import Transformer from 'transformer-response-data';

// Transformers
import { vuRoleTransformer } from './vu.role.transformer';
import { vuEntityTransformer } from './vu.entity.transformer';

//create transformer and define output properties
export let vuUserTransformer = new Transformer({
    "_id": "_id",
    "roles": "roles",
    "entities": "entities",
    "enabled": "enabled",
    "firstName": "firstName",
    "lastName": "lastName",
    "email": "email",
    "username": "username",
    "createdAt": "createdAt",
    "lastAccessAt": "lastAccessAt"
});