// создали роутер
const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getMe, patchUser } = require('../controllers/users');

// возвращает информацию о пользователе (email и имя)
// GET /users/me
router.get('/me', celebrate({
  body: Joi.object().keys({
    Authorization: Joi.string().required(),
  }),
}), getMe);

// обновляет информацию о пользователе (email и имя)
// PATCH /users/me
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
  }),
}), patchUser);

// экспортировали роутер
module.exports = router;
