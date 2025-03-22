const joi = require('joi');

module.exports.userForDelete = function (reqBody) {
    let schema = joi.object({
        deleteUserId: joi.number().required(),
    }).unknown(true);
    return schema.validate(reqBody, { allowUnknown: true });
}