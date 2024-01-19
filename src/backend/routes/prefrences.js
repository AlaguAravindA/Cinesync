const express = require('express');
const router = express.Router();
router.use(express.json());

const UserPreference = require('../models/userprefrence');

// Check if user preference exists for the given UID
router.get('/:uid', async (req, res) => {
  const uid = req.params.uid;



  try {
    const userPreference = await UserPreference.findOne({userId:uid });
  

    if (userPreference!=null) {
      // User preference exists for the given UID
      res.status(200).json({ exists: true });
    } else {
      // User preference does not exist for the given UID
      res.status(200).json({ exists: false });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Insert a new preference value for a specific UID
router.post('/setpref/:uid', async (req, res) => {
  const uid = req.params.uid;
  
  const preferenceValue = req.body.pref;
 

  try {
    let userPreference = await UserPreference.findOne({ userId: uid });

    if (!userPreference) {
      // If user preference doesn't exist, create a new one
      userPreference = new UserPreference({userId: uid, preference: preferenceValue });
      await userPreference.save();
    } else {
      // If user preference exists, update the existing one
      userPreference.preference = preferenceValue;
      await userPreference.save();
    }

    res.status(200).json({ message: 'User preference saved successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
