const { CustomAPIError } = require('../../utils/v2/custom-error')
const errorHandlerMiddleware = (err, req, res, next) => {
  if (err instanceof CustomAPIError) {
    return res.status(err.statusCode).json({ msg: `Err: ${err.message}` })
  }
  return res.status(500).json({ msg: 'Err: Something went wrong, please try again' })
}

module.exports = errorHandlerMiddleware
