module.exports = (err, req, res, next) => {
  res
    .status(err.statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: err.statusCode === 500
        ? 'На сервере произошла ошибка'
        : err.message,
    });

  next();
};
