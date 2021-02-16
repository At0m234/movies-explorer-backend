const { serverError } = require('../utils/constants');

// централизованный обработчик ошибок
const CentralizedErrorHandler = (err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res
    .status(err.statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === 500
        ? serverError
        : message,
    });
  next();
};

module.exports = CentralizedErrorHandler;
