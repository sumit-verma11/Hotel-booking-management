const express = require('express');
const { getStates, getCities } = require('../controllers/locationController');

const router = express.Router();

router.get('/state', getStates);
router.get('/city', getCities);

module.exports = router;
