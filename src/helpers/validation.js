/* VALIDATION */
const Joi = require('@hapi/joi')

/* Register Validation */
const registerValidation = data => {
    const schema = Joi.object({
        displayName: Joi.string()
            .max(256)
            .min(3),
        email: Joi.string()
            .email({
                minDomainSegments: 2,
                tlds: {
                    allow: ['com', 'net']
                }
            }),
        password: Joi.string()
            .max(30)
            .min(3)
            .required(),
        phoneNumber: Joi.string()
            .max(20)
            .min(6),
        photoURL: Joi.string()
    })
    return schema.validate(data)
}

/* Login Validation */
const loginValidation = data => {
    const schema = Joi.object({
        email: Joi.string()
            .email({
                minDomainSegments: 2,
                tlds: {
                    allow: ['com', 'net', 'org']
                }
            }),
        password: Joi.string()
            .max(30)
            .min(3)
            .required(),
    })
    return schema.validate(data)
}

module.exports = {
    loginValidation,
    registerValidation
}