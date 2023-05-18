const { HttpError } = require('../helpers');


const validateBody = schema => {
    const func = (req, res, next) => {
        const { error } = schema.validate(req.body);
      if(error) {
        let userField = error.message.split(' ')
        userField = `missing required ${userField[2]} field`
        next(HttpError(400, userField))
      }
      next();
    }
    return func
}

module.exports = validateBody;