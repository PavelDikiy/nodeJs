const expressSession = require('express-session');
const mongoose = require( 'mongoose' );
const MongoStore = require('connect-mongo')(expressSession);

const sessionStore = new MongoStore({mongooseConnection: mongoose.connection});

module.exports = sessionStore;
