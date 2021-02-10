const jwt = require('jsonwebtoken');
const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');
const UnauthorizedError = require('../errors/unauthorized-err');
const User = require('../models/user');

// контроллер обновляет информацию о пользователе
// PATCH /users/me
module.exports.patchUser = (req, res, next) => {
  User.findByIdAndUpdate(
    req.user._id,
    { name: req.body.name },
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
    },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Произошла ошибка, не удалось найти пользователей');
      }
      res.status(200).send({ data: user });
    })
    .catch((err) => next(err));
};

// контроллер возвращает информацию о пользователе (email и имя)
// GET /users/me
module.exports.getMe = (req, res, next) => {
  User.findById(req.user)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Неверный id пользователя');
      } else {
        res.status(200).send({ user });
      }
    })
    .catch(next);
};

// контроллер создает пользователя с переданными в теле email, password и name
// POST /signup
module.exports.createUser = (req, res, next) => {
  const {
    email, password, name,
  } = req.body;

  return User.createUserByCredentials(email, password, name)
    // вернём записанные в базу данные
    .then((user) => {
      if (!user) {
        throw new BadRequestError('Произошла ошибка, не удалось создать пользователя');
      }
      res.status(200).send({ data: user });
    })
    // данные не записались, вернём ошибку
    .catch(next);
};

// контроллер входа в систему и передачи JWT токена в LocalStorage браузера
// POST /signin
module.exports.login = (req, res, next) => {
  const { NODE_ENV, JWT_SECRET } = process.env;
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError('Неверная почта или пароль');
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
