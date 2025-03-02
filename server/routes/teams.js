const express = require('express');
const router = express.Router();
const Team = require('../models/Team');

// Get all teams
router.get('/', async (req, res) => {
  try {
    const teams = await Team.find();
    res.json(teams);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single team
router.get('/:id', async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) return res.status(404).json({ message: 'Team not found' });
    res.json(team);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a team
router.post('/', async (req, res) => {
  const team = new Team({
    name: req.body.name,
    description: req.body.description,
    members: req.body.members
  });

  try {
    const newTeam = await team.save();
    res.status(201).json(newTeam);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a team
router.patch('/:id', async (req, res) => {
  try {
    const updatedTeam = await Team.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedTeam);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a team
router.delete('/:id', async (req, res) => {
  try {
    await Team.findByIdAndDelete(req.params.id);
    res.json({ message: 'Team deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;