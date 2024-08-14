const express = require('express');
const router = express.Router();
const authController = require('../../controllers/authController');
const helper = require('../../helpers/helper');


router.post('/login', authController.login);
router.post('/signup', authController.signup);
router.get('/user-list',helper.checkAuthUser, authController.userlist); 

module.exports = router;
