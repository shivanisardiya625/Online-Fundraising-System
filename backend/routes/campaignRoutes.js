const express = require('express');
const router = express.Router();
const {
  getAllCampaigns,
  getCampaignById,
  createCampaign,
  updateCampaign,
  deleteCampaign,
  getMyCampaigns
} = require('../controllers/campaignController');
const auth = require('../middleware/auth');

// @route   GET /api/campaigns
// @desc    Get all campaigns
// @access  Public
router.get('/', getAllCampaigns);

// @route   GET /api/campaigns/my-campaigns
// @desc    Get current user's campaigns
// @access  Private
router.get('/my-campaigns', auth, getMyCampaigns);

// @route   GET /api/campaigns/:id
// @desc    Get campaign by ID
// @access  Public
router.get('/:id', getCampaignById);

// @route   POST /api/campaigns
// @desc    Create a campaign
// @access  Private
router.post('/', auth, createCampaign);

// @route   PUT /api/campaigns/:id
// @desc    Update a campaign
// @access  Private
router.put('/:id', auth, updateCampaign);

// @route   DELETE /api/campaigns/:id
// @desc    Delete a campaign
// @access  Private
router.delete('/:id', auth, deleteCampaign);

module.exports = router;
