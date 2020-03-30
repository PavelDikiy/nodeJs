const User = require('../models/user').User;
const createError = require('http-errors');
const AuthError = require('../models/user').AuthError;


exports.get = function ( req, res, next ) {

    res.render('login')
}

exports.post = function ( req, res, next ) {
    const username = req.body.username;
    const password = req.body.password;

    User.authorize(username, password, function(err, user) {
        if (err) {
            if (err instanceof AuthError) {
                return next(new createError(403, err.message));
            } else {
                return next(err);
            }
        }

        req.session.user = user._id;
        res.send({});

    });

    // старый код
/*    User.find({ username: username },function ( err, user ) {
        if(err) return next(err);

        if(user){
            if(user.checkPassword(password)){
                //...ok
            }else{
                //403
            }
        }else{
            const user = new User({ username: username, password: password });
            user.save(function ( err ) {
                if(err) return next(err)
            })
        }
    })*/

    //res.render('login')
}
