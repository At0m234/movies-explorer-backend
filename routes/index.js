// импортируем роутер пользователей
const usersRoutes = require('./users');
// импортируем роутер карточек фильмов
const moviesRoutes = require('./movies');

module.exports = {
  usersRoutes,
  moviesRoutes,
};
