const joi = require('joi');

module.exports.sourceOfMoneyCategoryForSave = function (reqBody) {
    let schema = joi.object({
        sourceOfMoneyCategoryName: joi.string().required(),
    }).unknown(true);
    return schema.validate(reqBody, { allowUnknown: true });
}