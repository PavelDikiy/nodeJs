const express = require('express');
const checkAuth = require('../middleware/checkAuth');
const router = express.Router();


/* GET home page. */
router.get('/', require('./frontpage').get);

router.get('/login', require('./login').get);

router.post('/login', require('./login').post);

router.post('/logout', require('./logout').post);

router.get('/chat', checkAuth, require('./chat').get);


module.exports = router;
