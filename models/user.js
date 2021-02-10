const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const ConflictError = require('../errors/conflict-err');

const { SALTROUNDS } = process.env;

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
        // const emailRegExp = /^([\w-.]+@([\w-]+\.)+[\w-]{2,4})?$/;
        return validator.isEmail(v);
      },
      message: 'Почта не соответсвует требуемому формату',
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
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }
      // нашёлся — сравниваем хеши
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error('Неправильные почта или пароль'));
          }
          return user;
        });
    });
};

// добавим метод создания пользоваля createUserByCredentials к схеме пользователя
userSchema.statics.createUserByCredentials = function createUser(
  email, password, name,
) {
  return this.findOne({ email })
    .then((user) => {
      if (user) {
        return Promise.reject(new ConflictError('Пользователь с таким email уже зарегистрирован!'));
      }
      // хешируем пароль
      return bcrypt.hash(password, SALTROUNDS)
        .then((hash) => {
          if (!hash) {
            return Promise.reject(new Error('Ошибка хеширования!'));
          }
          // создаем юзера в базе
          return this.create({
            email, password: hash, name,
          })
            .then((you) => {
              if (!you) {
                return Promise.reject(new Error('Ошибка записи данных!'));
              }
              // ищем юзера и возвращаем данные без password
              return this.findOne({ email });
            });
        });
    });
};

module.exports = mongoose.model('user', userSchema);
