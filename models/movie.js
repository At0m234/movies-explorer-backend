const mongoose = require('mongoose');
const { invalidURL, urlRegExp } = require('../utils/constants');

const movieSchema = new mongoose.Schema({
  // страна создания фильма. Обязательное поле-строка.
  country: {
    type: String,
    required: true,
  },
  // режиссёр фильма. Обязательное поле-строка.
  director: {
    type: String,
    required: true,
  },
  // длительность фильма. Обязательное поле-число.
  duration: {
    type: Number,
    required: true,
  },
  // год выпуска фильма. Обязательное поле-строка.
  year: {
    type: String,
    required: true,
  },
  // описание фильма. Обязательное поле-строка.
  description: {
    type: String,
    required: true,
  },
  // ссылка на постер к фильму. Обязательное поле-строка. Запишите её URL-адресом.
  image: {
    id: { type: Number },
    name: { type: String },
    alternativeText: { type: String },
    caption: { type: String },
    width: { type: Number },
    height: { type: Number },
    formats: {
      thumbnail: {
        hash: { type: String },
        ext: { type: String },
        mime: { type: String },
        width: { type: Number },
        height: { type: Number },
        size: { type: Number },
        path: { },
        url: { type: String },
      },
      small: {
        hash: { type: String },
        ext: { type: String },
        mime: { type: String },
        width: { type: Number },
        height: { type: Number },
        size: { type: Number },
        path: { },
        url: { type: String },
      },
    },
    hash: { type: String },
    ext: { type: String },
    mime: { type: String },
    size: { type: Number },
    url: { type: String },
    previewUrl: { },
    provider: { type: String },
    provider_metadata: { },
    created_at: { },
    updated_at: { },
  },
  // ссылка на трейлер фильма. Обязательное поле-строка. Запишите её URL-адресом.
  trailer: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return urlRegExp.test(v);
      },
      message: invalidURL,
    },
  },
  movieId: {
    type: Number,
    required: true,
  },
  // _id пользователя, который сохранил статью.
  // Нужно задать поведение по умолчанию, чтобы база данных не возвращала это поле.
  owner: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'user',
    required: true,
    selected: false,
  },
  // название фильма на русском языке. Обязательное поле-строка.
  nameRU: {
    type: String,
    required: true,
  },
  // название фильма на английском языке. Обязательное поле-строка.
  nameEN: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('movie', movieSchema);
