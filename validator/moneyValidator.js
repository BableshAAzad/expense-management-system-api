const joi = require('joi');

module.exports.sourceOfMoneyCategoryForSave = function (reqBody) {
    let schema = joi.object({
        sourceOfMoneyCategoryName: joi.string().required(),
    }).unknown(true);
    return schema.validate(reqBody, { allowUnknown: true });
}

module.exports.sourceOfMoneyCategoryForUpdate = function (reqBody) {
    let schema = joi.object({
        sourceOfMoneyCategoryId: joi.number().required(),
        sourceOfMoneyCategoryName: joi.string().required(),
    }).unknown(true);
    return schema.validate(reqBody, { allowUnknown: true });
}

module.exports.sourceOfMoneyCategoryForDelete = function (reqBody) {
    let schema = joi.object({
        sourceOfMoneyCategoryId: joi.number().required(),
    }).unknown(true);
    return schema.validate(reqBody, { allowUnknown: true });
}

