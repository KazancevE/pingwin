const express = require('express');
const router = express.Router();
const Organization = require('../models/Organization');
const Branch = require('../models/Branch');

router.get('/', async (req, res) => {
  try {
    const organizations = await Organization.find({ isActive: true });
    res.json(organizations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id/branches', async (req, res) => {
  try {
    const branches = await Branch.find({ 
      organization: req.params.id,
      isActive: true 
    }).populate('director', 'firstName lastName');
    res.json(branches);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;