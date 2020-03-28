const createError = require('http-errors');
const express = require('express');
const path = require('path');
const config = require('./config');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const logger = require('morgan');
const MongoStore = require('connect-mongo')(expressSession);
const mongoose = require( 'mongoose' );
//const HttpError = require('./error').HttpError;
//const errorhandler = require('errorhandler')();

const indexRouter = require('./routes/index');
//const usersRouter = require('./routes/users');

const app = express();

// view engine setup
app.engine('ejs', require('ejs-locals'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(expressSession( {
    secret: config.get( 'session:secret' ),
    key: config.get( 'session:key' ),
    cookie: config.get( 'session:cookie' ),
    resave: true,
    saveUninitialized: true,
    store: new MongoStore({mongooseConnection: mongoose.connection})
}));

app.use(function ( req, res, next ) {
    if (req.session.views) {
        req.session.views++
    } else {
        req.session.views = 1
    }
    res.send("Visits " + req.session.views );
});

app.use(express.static(path.join(__dirname, 'public')));


app.use('/', indexRouter);
//app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
/*app.use(function(err, req, res, next) {
    console.log("dddddd000000", err);
    if (typeof err === 'number') { // next(404);
        err = new HttpError(err);
    }

    if (err instanceof HttpError) {
        res.sendHttpError(err);
    } else {
        if (app.get('env') === 'development') {
            errorhandler(err, req, res, next);
        } else {
            //log.error(err);
            err = new HttpError(500);
            res.sendHttpError(err);
        }
    }
});*/
// default
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
