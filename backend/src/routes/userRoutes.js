const express = require('express');
const { getUserList } = require('../controllers/userController');

const router = express.Router();

router.get('/getUserList', getUserList);

module.exports = router;
