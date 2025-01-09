const Joi = require('joi');

const registerSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).pattern(/^(?=.*[!@#$%^&*])/).required(),
    role: Joi.string().valid('bakery', 'client').required(),
    name: Joi.when('role', { is: 'bakery', then: Joi.string().required() }),
    location: Joi.when('role', { is: 'bakery', then: Joi.string().required() }),
    description: Joi.string().optional(),
    bankDetails: Joi.when('role', {
        is: 'bakery',
        then: Joi.object({
            iban: Joi.string().required(),
            bankName: Joi.string().required(),
            accountOwner: Joi.string().required(),
        }).required(),
    }),
});

const clientRegisterSchema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string()
        .min(8)
        .pattern(/^(?=.*[!@#$%^&*])/)
        .required()
        .messages({
            'string.min': 'Password must be at least 8 characters long',
            'string.pattern.base': 'Password must contain at least one special character',
        }),
    confirmPassword: Joi.string()
        .valid(Joi.ref('password'))
        .optional()
        .messages({ 'any.only': 'Passwords must match' }),
    phone: Joi.string().required(),
    address: Joi.string().required(),
});
module.exports = { registerSchema, clientRegisterSchema };
