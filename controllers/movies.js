const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');
const NoRightsErr = require('../errors/no-rights-err');
const Movie = require('../models/movie');

// создаёт фильм с переданными в теле
// country, director, duration, year,
// description, image, trailer, nameRU, nameEN и thumbnail
// POST /movies
module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    nameRU,
    nameEN,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    nameRU,
    nameEN,
    owner: req.user._id,
  })
    .then((movie) => {
      if (!movie) {
        throw new BadRequestError('Произошла ошибка, не удалось создать карточку с фильмом');
      }
      res.send({ data: movie });
    })
    .catch((err) => next(err));
};

// возвращает все сохранённые пользователем фильмы
// GET /movies
module.exports.getOwnMovies = (req, res, next) => {
  const owner = req.user._id;

  Movie.find({ owner })
    .then((movies) => {
      if (!movies) {
        throw new NotFoundError('Произошла ошибка, не удалось найти фильмы');
      }
      res.send({ data: movies });
    })
    .catch((err) => next(err));
};

// удаляет сохранённый фильм по _id
// DELETE /movies/:movieId
module.exports.removeMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (movie === null) {
        throw new NotFoundError('Фильм не найден');
      } else if (String(movie.owner[0]) !== String(req.user._id)) {
        throw new NoRightsErr('У Вас нет прав на удаление фильмов других пользователей');
      } else if (String(req.params.movieId) !== String(movie._id)) {
        throw new BadRequestError('Неверный id фильма');
      }
      movie.remove()
        .then((deleted) => {
          res.status(200).send({ deleted });
        });
    })
    .catch((err) => next(err));
};
