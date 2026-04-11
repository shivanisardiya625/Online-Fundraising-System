const Donation = require('../models/Donation');
const Campaign = require('../models/Campaign');

// @route   POST /api/donations
// @desc    Make a donation
// @access  Private
const makeDonation = async (req, res) => {
  try {
    const { campaignId, amount, message } = req.body;

    // Find campaign
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    if (campaign.status !== 'active') {
      return res.status(400).json({ message: 'Campaign is not active' });
    }

    // Create donation
    const donation = new Donation({
      amount,
      donor: req.user.id,
      campaign: campaignId,
      message
    });

    await donation.save();

    // Update campaign raised amount
    campaign.raisedAmount += amount;
    await campaign.save();

    res.status(201).json(donation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @route   GET /api/donations/my-donations
// @desc    Get current user's donations
// @access  Private
const getMyDonations = async (req, res) => {
  try {
    const donations = await Donation.find({ donor: req.user.id })
      .populate('campaign', 'title imageUrl goalAmount raisedAmount')
      .sort({ createdAt: -1 });
    res.json(donations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @route   GET /api/donations/campaign/:campaignId
// @desc    Get donations for a campaign
// @access  Public
const getCampaignDonations = async (req, res) => {
  try {
    const donations = await Donation.find({ campaign: req.params.campaignId })
      .populate('donor', 'name')
      .sort({ createdAt: -1 });
    res.json(donations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  makeDonation,
  getMyDonations,
  getCampaignDonations
};
