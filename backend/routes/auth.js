const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.post('/telegram', async (req, res) => {
  try {
    const { telegramId, firstName, lastName, username } = req.body;
    
    let user = await User.findOne({ telegramId });
    
    if (!user) {
      user = new User({
        telegramId,
        firstName,
        lastName,
        username,
        role: 'student'
      });
      await user.save();
    }
    
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/check/:telegramId', async (req, res) => {
  try {
    const user = await User.findOne({ telegramId: req.params.telegramId });
    res.json({ exists: !!user, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;