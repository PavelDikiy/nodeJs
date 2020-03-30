const createError = require('http-errors');

module.exports = function(req, res, next) {
    if (!req.session.user) {
        return next(new createError(401, "Вы не авторизованы"));
    }

    next();
};
