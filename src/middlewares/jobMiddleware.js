import Joi from 'joi';

const createJobSchema = Joi.object({
    title: Joi.string().min(5).max(100).required(),
    department: Joi.string().min(2).max(50).required(),
    status: Joi.string().valid('OPEN', 'DRAFT', 'CLOSED').default('OPEN'),
    type: Joi.string().valid('FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERN').required(),
    deadline: Joi.date().greater('now').required().messages({
        'date.greater': 'Deadline must be in the future'
    }),
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

export const validateJob = (req, res, next) => {
  const { error } = createJobSchema.validate(req.body, { abortEarly: false });

  if (error) {
    const messages = error.details.map(detail => detail.message);
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      messages
    });
  }

  next();
};