const express = require('express');
const router = express.Router();
const Homework = require('../models/Homework');
const Submission = require('../models/Submission');

router.get('/student/:studentId', async (req, res) => {
  try {
    const homework = await Homework.find({
      $or: [
        { assignedTo: req.params.studentId },
        { assignedToGroup: req.params.studentId }
      ]
    }).populate('assignedBy', 'firstName lastName');
    
    res.json(homework);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const homework = new Homework(req.body);
    await homework.save();
    res.status(201).json(homework);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/:homeworkId/submit', async (req, res) => {
  try {
    const { studentId, answer, files } = req.body;
    
    const submission = new Submission({
      homework: req.params.homeworkId,
      student: studentId,
      answer,
      files,
      status: 'submitted'
    });
    
    await submission.save();
    res.json(submission);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;