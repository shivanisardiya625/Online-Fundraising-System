import { useState, useEffect } from 'react'
import CampaignCard from '../components/CampaignCard'

const Home = () => {
  const [campaigns, setCampaigns] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCampaigns()
  }, [])

  const fetchCampaigns = async () => {
    try {
      const res = await fetch('/api/campaigns')
      const data = await res.json()
      setCampaigns(data)
    } catch (error) {
      console.error('Error fetching campaigns:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
          <p className="mt-4 text-xl text-gray-600">Loading campaigns...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Hero Section */}
      <div className="relative mb-12 rounded-3xl overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1200&h=600&fit=crop" 
            alt="Fundraising" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-blue-600/80"></div>
        </div>
        
        <div className="relative z-10 text-center text-white p-12 md:p-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
             Online Fundraising Platform
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto">
            Support causes you care about and make a difference in someone's life
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl px-6 py-3">
              <span className="text-3xl font-bold">{campaigns.length}</span>
              <p className="text-sm">Active Campaigns</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl px-6 py-3">
              <span className="text-3xl font-bold">$0</span>
              <p className="text-sm">Total Raised</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl px-6 py-3">
              <span className="text-3xl font-bold">0</span>
              <p className="text-sm">Total Donors</p>
            </div>
          </div>
        </div>
      </div>

      {/* Campaigns Section */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
          <span className="text-4xl">🔥</span> Active Campaigns
        </h2>
        <p className="text-gray-600">Discover and support campaigns that need your help</p>
      </div>

      {campaigns.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl shadow-lg">
          <div className="text-6xl mb-4">😔</div>
          <p className="text-2xl text-gray-600 mb-2">No campaigns yet</p>
          <p className="text-gray-500">Be the first to create a campaign and start fundraising!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {campaigns.map((campaign) => (
            <CampaignCard key={campaign._id} campaign={campaign} />
          ))}
        </div>
      )}
    </div>
  )
}

export default Home
