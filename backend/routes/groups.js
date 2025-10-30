const express = require('express');
const router = express.Router();
const Group = require('../models/Group');

router.get('/', async (req, res) => {
  try {
    const groups = await Group.find()
      .populate('teacher', 'firstName lastName')
      .populate('students', 'firstName lastName');
    res.json(groups);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const group = await Group.findById(req.params.id)
      .populate('teacher', 'firstName lastName')
      .populate('students', 'firstName lastName');
    res.json(group);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const group = new Group(req.body);
    await group.save();
    res.status(201).json(group);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;