const express = require('express');
const router = express.Router();

const Userpref = require('../models/userprefrence');

router.get('/:uid', async (req, res) => {
  const uid = req.params.uid;

  try {
    // Find user preferences based on userId
    const userPreference = await Userpref.findOne({ userId: uid });

    if (!userPreference) {
      return res.status(404).json({ message: 'User preferences not found' });
    }

    // Respond with the user preferences
    res.status(200).json({ preferences: userPreference.preference});
  } catch (error) {
    console.error('Error fetching user preferences:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
