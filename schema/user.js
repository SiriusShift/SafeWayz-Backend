const { sign } = require("crypto");
const Joi = require("joi");

const signupSchema = Joi.object({
    fullname: Joi.string().required(),
    username: Joi.string().required(),
    password: Joi.string().required().length(8),
})

module.exports = {
    signupSchema
}