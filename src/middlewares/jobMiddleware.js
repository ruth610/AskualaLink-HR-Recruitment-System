import Joi from 'joi';

export const createJobSchema = Joi.object({
    title: Joi.string().min(5).max(100).required(),
    department: Joi.string().min(2).max(50).required(),
    status: Joi.string().valid('OPEN', 'ARCHIVED', 'CLOSED').default('OPEN'),
    type: Joi.string().valid('FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERN').required(),
    deadline: Joi.date().greater('now').required().messages({
        'date.greater': 'Deadline must be in the future'
    }),
    location: Joi.string().valid('REMOTE', 'ON_SITE', 'HYBRID').required(),
    salary_range: Joi.string().optional(),
    requirements: Joi.string().min(20).required(),
    custom_fields: Joi.array().items(
        Joi.object({
        key: Joi.string().required(),
        label: Joi.string().required(),
        type: Joi.string().valid('text', 'number', 'url', 'file').required(),
        required: Joi.boolean().default(false)
        })
    ).optional(),

    min_fit_score: Joi.number().min(1).max(10).default(1)
});

export const userSchema = Joi.object({
    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'org', 'edu', 'et'] } })
        .required()
        .messages({
            'string.email': 'Please provide a valid email address',
            'any.required': 'Email is mandatory'
        }),
        full_name: Joi.string().min(3).max(50).required(),
        password: Joi.string().min(8).required().messages({
            'string.min': 'Password must be at least 8 characters long',
            'any.required': 'Password is mandatory'
        }),
        role: Joi.string().valid('ADMIN', 'HR', 'STAFF').default('STAFF')
});


export const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const messages = error.details.map((detail) => detail.message);
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        messages
      });
    }

    next();
  };
};