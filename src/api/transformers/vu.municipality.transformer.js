import Transformer from 'transformer-response-data';

//create transformer and define output properties
export let vuMunicipalityTransformer = new Transformer({
    "_id": "_id",
    "municipality": "municipality",
    "versions": function (data) {
        return data.versions.map(item => {
            return {
                name: item.name,
                layer: item.layer,
                srs: item.srs
            };
        });
    },
    "createdAt": "createdAt"
});