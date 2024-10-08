const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const createError = require('http-errors');
const User = require('./models/user');  // Importa o modelo User

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();
const sequelize = require('./config/database');  // Importa a configuração do Sequelize

// Sync the model with the database
sequelize.sync();

app.locals.db = sequelize;  // Atribui a conexão à app.locals
app.locals.User = User;     // Atribui o modelo User à app.locals

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
