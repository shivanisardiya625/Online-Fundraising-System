const express = require('express');
const router = express.Router();
const { makeDonation, getMyDonations, getCampaignDonations } = require('../controllers/donationController');
const auth = require('../middleware/auth');

// @route   POST /api/donations
// @desc    Make a donation
// @access  Private
router.post('/', auth, makeDonation);

// @route   GET /api/donations/my-donations
// @desc    Get current user's donations
// @access  Private
router.get('/my-donations', auth, getMyDonations);

// @route   GET /api/donations/campaign/:campaignId
// @desc    Get donations for a campaign
// @access  Public
router.get('/campaign/:campaignId', getCampaignDonations);

module.exports = router;
