const express = require('express');
const { getHotelList } = require('../controllers/hotelController');

const router = express.Router();

router.get('/getHotelList', getHotelList);

module.exports = router;
