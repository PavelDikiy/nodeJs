const express = require('express');
const router = express.Router();
const User = require('../models/user').User;
const ObjectID = require('mongodb').ObjectID;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/users', function(req, res, next) {
    User.find({}, function ( err, users ) {
        if(err) return next(err);

        res.json(users);
        //res.send('respond with a resource');
    });

});

router.get('/user/:id', function(req, res, next) {
    let id;
    try {
        id = new ObjectID(req.params.id);
    } catch (e) {
        next(404);
        return;
    }

    User.findById(id, function(err, user) { // ObjectID
        if (err) return next(err);
        if (!user) {
            return next(404);
        }
        res.json(user);
    });
});

module.exports = router;
