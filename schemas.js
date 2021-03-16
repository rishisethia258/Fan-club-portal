const Joi = require('joi');

module.exports.clubSchema = Joi.object({
    club: Joi.object({
        name: Joi.string().required(),
        image: Joi.string().required(),
        description: Joi.string().required()
    }).required()
});
