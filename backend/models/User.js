const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  telegramId: { type: Number, unique: true, sparse: true },
  email: { type: String, sparse: true },
  phone: String,
  firstName: String,
  lastName: String,
  role: { 
    type: String, 
    enum: ['student', 'parent', 'teacher', 'manager', 'director', 'admin'], 
    required: true 
  },
  organization: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization' },
  branch: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch' },
  parents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },
  children: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  groups: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Group' }],
  managedBranches: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Branch' }],
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);