// создали роутер
const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getOwnMovies, createMovie, removeMovie } = require('../controllers/movies');

const { urlRegExp } = require('../utils/constants');

// возвращает все сохранённые пользователем фильмы
// GET /movies
router.get('/', getOwnMovies);

// создаёт фильм с переданными в теле
// country, director, duration, year,
// description, image, trailer, nameRU, nameEN и thumbnail
// POST /movies
router.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.object().keys({
      url: Joi.string() || null,
    }),
    trailerLink: Joi.string().required().pattern(new RegExp(urlRegExp)),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }).unknown(true),
}), createMovie);

// удаляет сохранённый фильм по _id
// DELETE /movies/:movieId
router.delete('/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().hex().required(),
  }).unknown(true),
}), removeMovie);

// экспортировали роутер
module.exports = router;
