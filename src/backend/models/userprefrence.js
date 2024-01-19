const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userPreferenceSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  preference: {
    type: Array,
    required: true,
  },
});

module.exports = mongoose.model('UserPreference', userPreferenceSchema);
