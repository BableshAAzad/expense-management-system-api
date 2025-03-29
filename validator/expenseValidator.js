const joi = require('joi');

module.exports.expenseCategoryForSave = function (reqBody) {
    let schema = joi.object({
        expenseCategoryName: joi.string().required(),
    }).unknown(true);
    return schema.validate(reqBody, { allowUnknown: true });
}

module.exports.expenseCategoryForDelete = function (reqBody) {
    let schema = joi.object({
        expenseCategoryId: joi.number().required(),
    }).unknown(true);
    return schema.validate(reqBody, { allowUnknown: true });
}