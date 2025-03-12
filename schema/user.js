const { sign } = require("crypto");
const Joi = require("joi");

const signupSchema = Joi.object({
    fullname: Joi.string().required(),
    email: Joi.string().email().required(),
    username: Joi.string().required(),
    password: Joi.string().required().min(8),
    code: Joi.string().required()
})

module.exports = {
    signupSchema
}