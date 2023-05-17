// const { createError } = require('../helpers')
const { HttpError } = require('../helpers');

const validateBodyUpdate = (req, res, next) => {
  const user = req.body
  if (Object.keys(user).length === 0) {
    throw HttpError(400, 'missing fields')
  }
  next()
}

module.exports = validateBodyUpdate;