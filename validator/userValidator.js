const joi = require('joi');

module.exports.userForDelete = function (reqBody) {
    let schema = joi.object({
        deleteUserId: joi.number().required(),
    }).unknown(true);
    return schema.validate(reqBody, { allowUnknown: true });
}

module.exports.userPhotoValidator = function (reqBody) {
    let schema = joi.object({
        // url: joi.string().optional().allow("", null),
        // id: joi.string().optional().allow("", null),
        url: joi.string().required(),
        id: joi.string().required(),
    }).unknown(true);
    return schema.validate(reqBody, { allowUnknown: true });
}