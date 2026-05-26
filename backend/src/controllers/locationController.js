const State = require('../models/State');
const City = require('../models/City');

const getStates = async (req, res) => {
  try {
    const states = await State.find().sort({ name: 1 });
    res.json({ success: true, data: states });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getCities = async (req, res) => {
  try {
    const { state } = req.query;
    const query = state ? { state: { $regex: state, $options: 'i' } } : {};
    const cities = await City.find(query).sort({ name: 1 });
    res.json({ success: true, data: cities });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getStates, getCities };
