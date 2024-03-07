import  Joi  from 'joi';

export const authSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string()
        .email().message('must be a valid email')
        .required(),
    password: Joi.string()
        .min(6).message('password min 6 character')
        .regex(/[ -~]*[a-z][ -~]*/).message('password min 1 lowercase') // at least 1 lower-case
        .regex(/[ -~]*[A-Z][ -~]*/).message('password min 1 uppercase') // at least 1 upper-case
        .required(),
});

export const loginSchema = Joi.object({
    email: Joi.string()
        .email().message('must be a valid email')
        .required(),
    password: Joi.string()
        .min(6).message('password min 6 character')
        .regex(/[ -~]*[a-z][ -~]*/).message('password min 1 lowercase') // at least 1 lower-case
        .regex(/[ -~]*[A-Z][ -~]*/).message('password min 1 uppercase') // at least 1 upper-case
        .required(),
});

export const passwordSchema = Joi.object({
    password: Joi.string()
        .min(6).message('password min 6 character')
        .regex(/[ -~]*[a-z][ -~]*/).message('password min 1 lowercase') // at least 1 lower-case
        .regex(/[ -~]*[A-Z][ -~]*/).message('password min 1 uppercase') // at least 1 upper-case
        .required(),
    newpassword: Joi.string()
        .min(6).message('password min 6 character')
        .regex(/[ -~]*[a-z][ -~]*/).message('password min 1 lowercase') // at least 1 lower-case
        .regex(/[ -~]*[A-Z][ -~]*/).message('password min 1 uppercase') // at least 1 upper-case
        .required(),
    confPassword: Joi.string()
});