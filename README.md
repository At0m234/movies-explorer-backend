# __Yandex.Practicum. Web Development training course. Graduate work. Movies-Explorer application Backend.__ 

## __[Application Frontend here](https://github.com/At0m234/movies-explorer-frontend)__
## __[GitHub Pages (Frontend)](https://at0m234.github.io/movies-explorer-frontend/)__

<!-- ## __[View the Site](http://movexp.students.nomoredomains.icu/)__ -->

<!-- ## __Публичный IPv4: 84.252.130.214.__ -->

## __Functionality__
Movies-Explorer - backand of adaptive multi-page application. 
Server allows you:
 - register (hash password);
 - login;
 - edit information about yourself;
 - search for movies;
 - save the movies you like.

## __Available Scripts__

### __`npm run start`__ 
starts the server on PORT = 4000;
### __`npm run dev`__ 
starts the server in development mode with hot-reload on PORT = 4000;

## __Requests__

### `POST http://localhost:4000/signup`
Registration;

### `POST http://localhost:4000/signin`
Login;

### `GET http://localhost:4000/users/me`
Returns user info;

### `PATCH http://localhost:4000/users/me`
Updates user info;

### `GET http://localhost:4000/movies`
Returns saved movies; 

### `POST http://localhost:4000/movies`
Creates movie; 

### `POST http://localhost:4000/movies/:movieId`
Removes movie from saved; 

## __Directories__

### `/controllers` 
folder with movies and users request controllers; 
### `/errors` 
folder with request error classes;
### `/middlewares` 
folder with authorization, limiter, logger and centralized-error-handlers middlewares; 
### `/models` 
folder with schemas of the user and the movie; 
### `/routes` 
folder with request routes.

## __Stack__

### `Node.js`

### `Express`

### `Mongoose`

### `MongoDB`

### `Celebrate`
### `Logger`
