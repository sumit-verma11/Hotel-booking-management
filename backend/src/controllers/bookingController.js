const Booking = require('../models/Booking');
const xl = require('excel4node');

const STATUS = { CONFIRMED: 0, CANCELLED: 1, COMPLETED: 2 };

const getBookings = async (req, res) => {
  try {
    const {
      userId, hotelId, status, fromDate, toDate,
      page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc', download
    } = req.query;

    const query = {};
    if (userId) query.userId = userId;
    if (hotelId) query.hotelId = hotelId;
    if (status !== undefined && status !== '') query.status = parseInt(status);
    if (fromDate || toDate) {
      query.checkInDate = {};
      if (fromDate) query.checkInDate.$gte = new Date(fromDate);
      if (toDate) query.checkInDate.$lte = new Date(toDate);
    }

    const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

    if (download === 'true') {
      const bookings = await Booking.find(query)
        .sort(sort)
        .populate('userId', 'name email phone')
        .populate('hotelId', 'name city state');

      const wb = new xl.Workbook();
      const ws = wb.addWorksheet('Bookings');

      const headerStyle = wb.createStyle({ font: { bold: true } });
      const headers = ['Guest Name', 'Email', 'Phone', 'Hotel Name', 'City', 'State', 'Check-in Date', 'Guests', 'Status', 'Special Requests', 'Booking Date'];

      headers.forEach((h, i) => ws.cell(1, i + 1).string(h).style(headerStyle));

      const statusLabels = { 0: 'Confirmed', 1: 'Cancelled', 2: 'Completed' };

      bookings.forEach((b, i) => {
        const row = i + 2;
        ws.cell(row, 1).string(b.userId?.name || '');
        ws.cell(row, 2).string(b.userId?.email || '');
        ws.cell(row, 3).string(b.userId?.phone || '');
        ws.cell(row, 4).string(b.hotelId?.name || '');
        ws.cell(row, 5).string(b.hotelId?.city || '');
        ws.cell(row, 6).string(b.hotelId?.state || '');
        ws.cell(row, 7).string(b.checkInDate ? new Date(b.checkInDate).toLocaleDateString() : '');
        ws.cell(row, 8).number(b.numberOfGuests || 0);
        ws.cell(row, 9).string(statusLabels[b.status] || '');
        ws.cell(row, 10).string(b.specialRequests || '');
        ws.cell(row, 11).string(b.bookingDate ? new Date(b.bookingDate).toLocaleDateString() : '');
      });

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=bookings.xlsx');
      return wb.write('bookings.xlsx', res);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [bookings, total] = await Promise.all([
      Booking.find(query)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .populate('userId', 'name email phone')
        .populate('hotelId', 'name city state location'),
      Booking.countDocuments(query)
    ]);

    res.json({
      success: true,
      data: bookings,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const createBooking = async (req, res) => {
  try {
    const { userId, hotelId, checkinDate, guestCount, requirements } = req.body;

    if (!userId || !hotelId || !checkinDate || !guestCount) {
      return res.status(400).json({ success: false, message: 'userId, hotelId, checkinDate, and guestCount are required' });
    }

    const checkIn = new Date(checkinDate);
    const now = new Date();

    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const checkInDay = new Date(checkIn);
    checkInDay.setHours(0, 0, 0, 0);

    if (checkInDay.getTime() === tomorrow.getTime() && now.getHours() >= 21) {
      return res.status(400).json({ success: false, message: 'Bookings for the next day cannot be made after 9 PM' });
    }

    const checkInStart = new Date(checkIn);
    checkInStart.setHours(0, 0, 0, 0);
    const checkInEnd = new Date(checkIn);
    checkInEnd.setHours(23, 59, 59, 999);

    const duplicate = await Booking.findOne({
      userId,
      hotelId,
      checkInDate: { $gte: checkInStart, $lte: checkInEnd },
      status: { $ne: STATUS.CANCELLED }
    });

    if (duplicate) {
      return res.status(400).json({ success: false, message: 'You already have a booking at this hotel for the same day' });
    }

    const booking = await Booking.create({
      userId,
      hotelId,
      checkInDate: checkIn,
      numberOfGuests: guestCount,
      specialRequests: requirements || '',
      status: STATUS.CONFIRMED,
      bookingDate: now
    });

    const populated = await booking.populate([
      { path: 'userId', select: 'name email phone' },
      { path: 'hotelId', select: 'name city state' }
    ]);

    res.status(201).json({ success: true, data: populated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    if (booking.status === STATUS.CANCELLED) {
      return res.status(400).json({ success: false, message: 'Booking is already cancelled' });
    }

    booking.status = STATUS.CANCELLED;
    await booking.save();

    res.json({ success: true, data: booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getBookings, createBooking, cancelBooking };
