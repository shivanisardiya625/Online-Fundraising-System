const Campaign = require('../models/Campaign');
const Donation = require('../models/Donation');

// @route   GET /api/campaigns
// @desc    Get all campaigns
// @access  Public
const getAllCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find({ status: 'active' })
      .populate('creator', 'name email')
      .sort({ createdAt: -1 });
    res.json(campaigns);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @route   GET /api/campaigns/:id
// @desc    Get campaign by ID
// @access  Public
const getCampaignById = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id)
      .populate('creator', 'name email');
    
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    // Get donations for this campaign
    const donations = await Donation.find({ campaign: req.params.id })
      .populate('donor', 'name')
      .sort({ createdAt: -1 });

    res.json({ campaign, donations });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @route   POST /api/campaigns
// @desc    Create a campaign
// @access  Private
const createCampaign = async (req, res) => {
  try {
    const { title, description, goalAmount, imageUrl, deadline } = req.body;

    const campaign = new Campaign({
      title,
      description,
      goalAmount,
      imageUrl,
      deadline,
      creator: req.user.id
    });

    await campaign.save();
    res.status(201).json(campaign);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @route   PUT /api/campaigns/:id
// @desc    Update a campaign
// @access  Private (creator only)
const updateCampaign = async (req, res) => {
  try {
    let campaign = await Campaign.findById(req.params.id);

    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    // Check if user is the creator
    if (campaign.creator.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    campaign = await Campaign.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.json(campaign);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @route   DELETE /api/campaigns/:id
// @desc    Delete a campaign
// @access  Private (creator only)
const deleteCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);

    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    // Check if user is the creator
    if (campaign.creator.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Delete all donations for this campaign
    await Donation.deleteMany({ campaign: req.params.id });
    
    await campaign.deleteOne();
    res.json({ message: 'Campaign removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @route   GET /api/campaigns/my-campaigns
// @desc    Get current user's campaigns
// @access  Private
const getMyCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find({ creator: req.user.id })
      .sort({ createdAt: -1 });
    res.json(campaigns);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAllCampaigns,
  getCampaignById,
  createCampaign,
  updateCampaign,
  deleteCampaign,
  getMyCampaigns
};
