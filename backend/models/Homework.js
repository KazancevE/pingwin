const mongoose = require('mongoose');

const homeworkSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  files: [String],
  deadline: Date,
  assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  assignedToGroup: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },
  organization: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization' },
  branch: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Homework', homeworkSchema);