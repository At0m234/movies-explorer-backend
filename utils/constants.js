// константы сообщений об ошибках фильмов
const createFilmError = 'Произошла ошибка, не удалось создать карточку с фильмом';
const idExistsError = 'Фильм с таким id уже существует';
const searchFilmError = 'Произошла ошибка, не удалось найти фильмы';
const noRightsError = 'У Вас нет прав на удаление фильмов других пользователей';
const invalidMovieId = 'Неверный id фильма';

// константы сообщений об ошибках пользователей
const searchUsersError = 'Произошла ошибка, не удалось найти пользователей';
const invalidUserId = 'Неверный id пользователя';
const createUserError = 'Произошла ошибка, не удалось создать пользователя';
const userExistsError = 'Пользователь с таким email уже зарегистрирован';

// константы сообщений об ошибках авторизации
const invalidEmailOrPassword = 'Неверная почта или пароль';
const loginError = 'Необходима авторизация';

// константы сообщений о невалидных данных
const invalidURL = 'URL не соответсвует требуемому формату';
const invalidEmail = 'Почта не соответсвует требуемому формату';

// константы сообщений об ошибках на сервере
const serverError = 'На сервере произошла ошибка';
const hashError = 'Ошибка хеширования';
const dataRecordingError = 'Ошибка записи данных';
const serverIsFalling = 'Сервер сейчас упадёт';
const requestedResourceWasNotFound = 'Запрашиваемый ресурс не найден';

const urlRegExp = /^(https?:\/\/)([\da-z.-]{1,})(\.)([a-z]{2,6})(\/?)([\da-z-.\W]*)/;
const emailRegExp = /^([\w-.]+@([\w-]+\.)+[\w-]{2,4})?$/;

module.exports = {
  createFilmError,
  idExistsError,
  searchFilmError,
  noRightsError,
  invalidMovieId,
  searchUsersError,
  invalidUserId,
  createUserError,
  invalidEmailOrPassword,
  loginError,
  serverError,
  invalidURL,
  invalidEmail,
  userExistsError,
  hashError,
  dataRecordingError,
  serverIsFalling,
  requestedResourceWasNotFound,
  urlRegExp,
  emailRegExp,
};
