// создали роутер
const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getOwnMovies, createMovie, removeMovie } = require('../controllers/movies');

const { urlRegExp } = require('../utils/constants');

const createMovieSchema = Joi.object({
  country: Joi.string().required(),
  director: Joi.string().required(),
  duration: Joi.number().required(),
  year: Joi.string().required(),
  description: Joi.string().required(),
  image: Joi.string().required().pattern(new RegExp(urlRegExp)).required(),
  trailer: Joi.string().required().pattern(new RegExp(urlRegExp)).required(),
  thumbnail: Joi.string().required().pattern(new RegExp(urlRegExp)).required(),
  movieId: Joi.number().required(),
  nameRU: Joi.string().required(),
  nameEN: Joi.string().required(),
});

// возвращает все сохранённые пользователем фильмы
// GET /movies
router.get('/', getOwnMovies);

// создаёт фильм с переданными в теле
// country, director, duration, year,
// description, image, trailer, nameRU, nameEN и thumbnail
// POST /movies
router.post('/', celebrate({
  body: createMovieSchema,
}), createMovie);

// удаляет сохранённый фильм по _id
// DELETE /movies/:movieId
router.delete('/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().hex().required(),
  }),
}), removeMovie);

// экспортировали роутер
module.exports = router;
