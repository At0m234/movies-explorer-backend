const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const ConflictError = require('../errors/conflict-err');
const UnauthorizedError = require('../errors/unauthorized-err');
const {
  invalidEmail,
  invalidEmailOrPassword,
  userExistsError,
  hashError,
  dataRecordingError,
} = require('../utils/constants');

const userSchema = mongoose.Schema({
  // почта пользователя, по которой он регистрируется.
  // Это обязательное поле, уникальное для каждого пользователя.
  // Также оно должно валидироваться на соответствие схеме электронной почты.
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(v) {
        return validator.isEmail(v);
      },
      message: invalidEmail,
    },
  },
  // хеш пароля.
  // Обязательное поле-строка.
  // Нужно задать поведение по умолчанию,
  // чтобы база данных не возвращала это поле.
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
  },
  // имя пользователя.
  // Это обязательное поле-строка от 2 до 30 символов.
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
    new: true,
  },
});

// добавим метод поиска пользователя findUserByCredentials к схеме пользователя
userSchema.statics.findUserByCredentials = function findUser(email, password) {
  // попытаемся найти пользовател по почте
  return this.findOne({ email }).select('+password') // this — это модель User
    .then((user) => {
      // не нашёлся — отклоняем промис
      if (!user) {
        throw new UnauthorizedError(invalidEmailOrPassword);
      }
      // нашёлся — сравниваем хеши
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new UnauthorizedError(invalidEmailOrPassword);
          }
          return user;
        });
    });
};

// добавим метод создания пользоваля createUserByCredentials к схеме пользователя
userSchema.statics.createUserByCredentials = function createUser(
  email, password, SALTROUNDS, name,
) {
  return this.findOne({ email })
    .then((user) => {
      if (user) {
        throw new ConflictError(userExistsError);
      }
      // хешируем пароль
      return bcrypt.hash(password, SALTROUNDS)
        .then((hash) => {
          if (!hash) {
            throw new Error(hashError);
          }
          // создаем юзера в базе
          return this.create({
            email, password: hash, name,
          })
            .then((you) => {
              if (!you) {
                throw new Error(dataRecordingError);
              }
              // ищем юзера и возвращаем данные без password
              return this.findOne({ email });
            });
        });
    });
};

module.exports = mongoose.model('user', userSchema);
