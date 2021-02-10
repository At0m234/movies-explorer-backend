const rateLimit = require('express-rate-limit');

module.exports.limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 минут
  max: 100, // ограничение в 100 запросов с каждого IP адреса
  message: {
    status: 429,
    error: 'Вы превысили допустимое количество запросов.',
  },
});
