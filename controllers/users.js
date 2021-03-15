const jwt = require('jsonwebtoken');
const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');
const UnauthorizedError = require('../errors/unauthorized-err');
const {
  searchUsersError,
  invalidUserId,
  createUserError,
  invalidEmailOrPassword,
} = require('../utils/constants');

const User = require('../models/user');

// контроллер обновляет информацию о пользователе
// PATCH /users/me
const patchUser = (req, res, next) => {
  User.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
    },
  )
    .then((data) => {
      if (!data) {
        return new NotFoundError(searchUsersError);
      }
      if ((req.body.email === data.email) && (req.body.name === data.name)) {
        return new Error('Вы не изменили информацию о пользователе');
      }
      res.status(200).send({ data });
      return data;
    })
    .catch((err) => next(err));
};

// контроллер возвращает информацию о пользователе (email и имя)
// GET /users/me
const getMe = (req, res, next) => {
  User.findById(req.user)
    .then((data) => {
      if (!data) {
        throw new NotFoundError(invalidUserId);
      } else {
        res.status(200).send({ data });
      }
    })
    .catch(next);
};

// контроллер создает пользователя с переданными в теле email, password и name
// POST /signup
const createUser = (req, res, next) => {
  const SALTROUNDS = 10;
  const {
    email, password, name,
  } = req.body;

  return User.createUserByCredentials(email, password, SALTROUNDS, name)
    // вернём записанные в базу данные
    .then((data) => {
      if (!data) {
        throw new BadRequestError(createUserError);
      }
      res.status(200).send({ data });
    })
    // данные не записались, вернём ошибку
    .catch(next);
};

// контроллер входа в систему и передачи JWT токена в LocalStorage браузера
// POST /signin
const login = (req, res, next) => {
  const { NODE_ENV, JWT_SECRET } = process.env;
  const { email, password } = req.body;
  console.log(req.body)
  return User.findUserByCredentials(email, password)
    .then((user) => {
      console.log(user)
      if (!user) {
        throw new UnauthorizedError(invalidEmailOrPassword);
      }
      // аутентификация успешна! пользователь в переменной user
      // создадим токен
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key',
        { expiresIn: '7d' },
      );
      // вернём токен
      res.send({ token });
    })
    // возвращаем ошибку аутентификации
    .catch(next);
};

module.exports = {
  patchUser,
  getMe,
  createUser,
  login,
};
