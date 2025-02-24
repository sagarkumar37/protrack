const { body, validationResult } = require('express-validator');

const allowedDimensions = ['employee', 'project', 'activity_type', 'day'];

exports.validateTimesheetReport = [
  // Validate and sanitize start_date and end_date
  body('start_date')
    .optional({ nullable: true })
    .isISO8601().withMessage('start_date must be a valid ISO8601 date (YYYY-MM-DD)')
    .toDate(),
  
  body('end_date')
    .optional({ nullable: true })
    .isISO8601().withMessage('end_date must be a valid ISO8601 date (YYYY-MM-DD)')
    .toDate(),

  // Validate employee_ids
  body('employee_ids')
    .optional({ nullable: true })
    .custom(value => {
      if (value && !Array.isArray(value)) {
        throw new Error('employee_ids must be an array');
      }
      return true;
    })
    .custom(value => {
      if (value && value.some(e => typeof e !== 'number')) {
        throw new Error('employee_ids must be an array of numbers');
      }
      return true;
    }),

  // Validate project_ids
  body('project_ids')
    .optional({ nullable: true })
    .custom(value => {
      if (value && !Array.isArray(value)) {
        throw new Error('project_ids must be an array');
      }
      return true;
    })
    .custom(value => {
      if (value && value.some(p => typeof p !== 'number')) {
        throw new Error('project_ids must be an array of numbers');
      }
      return true;
    }),

  // Validate activity_types
  body('activity_types')
    .optional({ nullable: true })
    .custom(value => {
      if (value && !Array.isArray(value)) {
        throw new Error('activity_types must be an array');
      }
      return true;
    })
    .custom(value => {
      if (value && value.some(a => typeof a !== 'string')) {
        throw new Error('activity_types must be an array of strings');
      }
      return true;
    }),

  // Validate aggregationDimensions
  body('aggregationDimensions')
  .optional({ nullable: true })
  .custom((value, { req }) => {
    if (value === null) {
      // Force it to an empty array
      req.body.aggregationDimensions = [];
    }
    if (value && !Array.isArray(value)) {
      throw new Error('aggregationDimensions must be an array');
    }
    return true;
  }),



  

  // Final check for validation errors
  (req, res, next) => {
    console.log("request body: ", req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Return 400 with error details
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];
