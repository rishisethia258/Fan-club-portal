const Joi = require('joi');

module.exports.clubSchema = Joi.object({
    club: Joi.object({
        name: Joi.string().required(),
        image: Joi.string().required(),
        description: Joi.string().required()
    }).required()
});

module.exports.chatSchema = Joi.object({
    chat: Joi.object({
        message: Joi.string().required()
    }).required()
});