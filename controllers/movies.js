const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');
const NoRightsErr = require('../errors/no-rights-err');
const ConflictError = require('../errors/conflict-err');
const {
  idExistsError,
  searchFilmError,
  noRightsError,
  invalidMovieId,
} = require('../utils/constants');

const Movie = require('../models/movie');

// создаёт фильм с переданными в теле
// country, director, duration, year,
// description, image, trailer, nameRU, nameEN и thumbnail
// POST /movies
const createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    movieId,
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
    movieId,
    owner: req.user._id,
  })
    .then((movie) => {
      if (movie) {
        res.send({ data: movie });
      } else {
        throw new ConflictError(idExistsError);
      }
    })
    .catch((err) => next(err));
};

// возвращает все сохранённые пользователем фильмы
// GET /movies
const getOwnMovies = (req, res, next) => {
  const owner = req.user._id;

  Movie.find({ owner })
    .then((movies) => {
      if (!movies) {
        throw new NotFoundError(searchFilmError);
      }
      res.send({ data: movies });
    })
    .catch((err) => next(err));
};

// удаляет сохранённый фильм по _id
// DELETE /movies/:movieId
const removeMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (movie === null) {
        throw new NotFoundError(searchFilmError);
      } else if (String(movie.owner[0]) !== String(req.user._id)) {
        throw new NoRightsErr(noRightsError);
      } else if (String(req.params.movieId) !== String(movie._id)) {
        throw new BadRequestError(invalidMovieId);
      }
      movie.remove()
        .then((deleted) => {
          res.status(200).send({ deleted });
        });
    })
    .catch((err) => next(err));
};

module.exports = {
  createMovie,
  getOwnMovies,
  removeMovie,
};
