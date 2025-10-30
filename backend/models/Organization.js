const mongoose = require('mongoose');

const organizationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  contactEmail: String,
  contactPhone: String,
  website: String,
  address: String,
  logo: String,
  isActive: { type: Boolean, default: true },
  settings: {
    timezone: { type: String, default: 'Europe/Moscow' },
    language: { type: String, default: 'ru' },
    homeworkDeadlineDays: { type: Number, default: 7 }
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Organization', organizationSchema);