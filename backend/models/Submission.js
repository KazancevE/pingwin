const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  homework: { type: mongoose.Schema.Types.ObjectId, ref: 'Homework', required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  answer: String,
  files: [String],
  submittedAt: { type: Date, default: Date.now },
  grade: { type: Number, min: 1, max: 5 },
  teacherComment: String,
  status: { 
    type: String, 
    enum: ['not_submitted', 'submitted', 'graded'], 
    default: 'not_submitted' 
  }
});

module.exports = mongoose.model('Submission', submissionSchema);