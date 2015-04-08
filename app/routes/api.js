'use strict';

var express         = require('express'),
    AuthController  = require('../controllers/auth'),
    UsersController = require('../controllers/users'),
    router          = express.Router();

// authentication
var auth = express.Router();
auth.get('/', AuthController.get);
auth.post('/', AuthController.login);
auth.delete('/', AuthController.logout);
router.use('/auth', auth);

// users
var users = express.Router();
users.get('/', UsersController.list);
users.post('/', UsersController.create);
users.get('/:username', UsersController.get);
users.put('/:username', UsersController.update);
users.delete('/:username', UsersController.remove);
router.use('/users', users);

module.exports = router;
