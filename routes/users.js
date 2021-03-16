// создали роутер
const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getMe, patchUser } = require('../controllers/users');

// возвращает информацию о пользователе (email и имя)
// GET /users/me
router.get('/me', celebrate({
  body: Joi.object().keys({
    authorization: Joi.string().required(),
  }).unknown(true),
}), getMe);

// обновляет информацию о пользователе (email и имя)
// PATCH /users/me
router.patch('/me', celebrate({
  data: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().email().required(),
  }).unknown(true),
}), patchUser);

// экспортировали роутер
module.exports = router;
