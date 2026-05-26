const Hotel = require('../models/Hotel');

const getHotelList = async (req, res) => {
  try {
    const { search, state, city, rating, status, page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

    const query = {};

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    if (state) {
      query.state = { $regex: state, $options: 'i' };
    }
    if (city) {
      query.city = { $regex: city, $options: 'i' };
    }
    if (rating) {
      query.rating = parseInt(rating);
    }
    if (status !== undefined && status !== '') {
      query.isActive = status === 'active';
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

    const [hotels, total] = await Promise.all([
      Hotel.find(query).sort(sort).skip(skip).limit(parseInt(limit)),
      Hotel.countDocuments(query)
    ]);

    res.json({
      success: true,
      data: hotels,
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

module.exports = { getHotelList };
