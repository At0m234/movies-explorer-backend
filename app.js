require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
// const helmet = require('helmet');
const cors = require('cors');
const { celebrate, Joi, errors } = require('celebrate');
const { limiter } = require('./middlewares/limiter');

// импортируем мидлверы
const { auth } = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');

// импортируем контроллеры логина и регистрации
const { login, createUser } = require('./controllers/users');
// импортируем класс ошибки
const NotFoundError = require('./errors/not-found-err');
const CentralizedErrorHandler = require('./middlewares/centralized-error-handler');
const { serverIsFalling, requestedResourceWasNotFound } = require('./utils/constants');
// импортируем роутеры пользователей и фильмов
const { usersRoutes, moviesRoutes } = require('./routes/index');
// Слушаем 3000 порт
const { PORT = 3000 } = process.env;
const { MOV_EXP_DB = 'mongodb://localhost:27017/moviesExplorerDB' } = process.env;

const app = express();

// bodyParser для сбора JSON-формата
app.use(bodyParser.json());
// разрешаем прием веб-страниц внутри POST-запроса
app.use(bodyParser.urlencoded({ extended: true }));

// app.use(helmet());

// подключаемся к серверу mongo
mongoose.connect(MOV_EXP_DB, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

// подключаем cors

// app.all('*', (req, res, next) => {
//   res.header('Access-Control-Allow-Origin', 'https://movexp.students.nomoredomains.icu');
//   res.header('Access-Control-Allow-Methods', 'PUT, PATCH, GET, POST, DELETE, OPTIONS');
//   res.header('Access-Control-Allow-Headers', 'Content-Type');
//   res.header('Access-Control-Allow-Headers', 'Accept');
//   res.header('Access-Control-Allow-Headers', 'authorization');
//   next();
// });

// const allowedCors = [
//   'http://api.movexp.students.nomoredomains.icu',
//   'https://api.movexp.students.nomoredomains.icu',
//   'http://movexp.students.nomoredomains.icu',
//   'https://movexp.students.nomoredomains.icu',
//   'http://localhost:3000',
// ];

app.use(cors());

// app.use((req, res, next) => {
//   const { origin } = req.headers;

//   if (allowedCors.includes(origin)) {
//     res.header('Access-Control-Allow-Origin', origin);
//   }

//   next();
// });

// app.options('*', cors());

// app.use(cors({
//   'Access-Control-Allow-Origin': 'https://movexp.students.nomoredomains.icu',
//   'Access-Control-Allow-Methods': 'PUT, PATCH, GET, POST, DELETE, OPTIONS',
//   'Access-Control-Allow-Headers': 'Content-Type, Accept, authorization',
//   origin: 'https://movexp.students.nomoredomains.icu',
//   credentials: true,
// }));

// подключаем логгер запросов
app.use(requestLogger);

// подключаем лимитер запросов
app.use(limiter);

// подключаем роуты, не требующие авторизации
// роут регистрации создаёт пользователя
// с переданными в теле email, password и name
app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().required().min(2).max(30),
  }).unknown(true),
}), createUser);

// роут логина проверяет переданные в теле почту и пароль и возвращает JWT
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);

// подключаем краш-тест сервера
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error(serverIsFalling);
  }, 0);
});

// подключаем роуты, требующие авторизации
app.use('/users', auth, usersRoutes);
app.use('/movies', auth, moviesRoutes);

// обработчики ошибок
app.all('*', () => {
  throw new NotFoundError(requestedResourceWasNotFound);
});

// подключаем логгер ошибок
app.use(errorLogger);
// обработчик ошибок celebrate
app.use(errors());
// здесь обрабатываем все ошибки
app.use(CentralizedErrorHandler);

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
