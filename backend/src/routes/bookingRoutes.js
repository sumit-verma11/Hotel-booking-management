const express = require('express');
const { getBookings, createBooking, cancelBooking } = require('../controllers/bookingController');

const router = express.Router();

router.get('/getBookings', getBookings);
router.post('/createBooking', createBooking);
router.post('/:bookingId/cancel', cancelBooking);

module.exports = router;
