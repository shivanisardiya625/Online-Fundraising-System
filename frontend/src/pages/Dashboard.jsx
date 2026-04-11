import { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import API_BASE from '../config/api'

const Dashboard = () => {
  const [myCampaigns, setMyCampaigns] = useState([])
  const [myDonations, setMyDonations] = useState([])
  const [loading, setLoading] = useState(true)
  const { user, token } = useContext(AuthContext)
  const navigate = useNavigate()

  useEffect(() => {
    if (!token) {
      navigate('/login')
      return
    }
    fetchData()
  }, [token])

  const fetchData = async () => {
    try {
      const headers = { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
      
      const campaignsRes = await fetch(`${API_BASE}/api/campaigns/my-campaigns`, { headers })
      const campaignsData = await campaignsRes.json()
      setMyCampaigns(Array.isArray(campaignsData) ? campaignsData : [])

      const donationsRes = await fetch(`${API_BASE}/api/donations/my-donations`, { headers })
      const donationsData = await donationsRes.json()
      setMyDonations(Array.isArray(donationsData) ? donationsData : [])
    } catch (error) {
      console.error('Error fetching data:', error)
      setMyCampaigns([])
      setMyDonations([])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
          <p className="mt-4 text-xl text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  const totalRaised = myCampaigns.reduce((sum, c) => sum + (c.raisedAmount || 0), 0)
  const totalDonated = myDonations.reduce((sum, d) => sum + (d.amount || 0), 0)

  return (
    <div>
      {/* Welcome Section */}
      <div className="bg-blue-600 rounded-3xl p-8 text-white mb-8 shadow-lg">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              Welcome back, {user?.name || 'User'}! 👋
            </h1>
            <p className="text-white/90 text-lg">Manage your campaigns and track your donations</p>
          </div>
          <Link
            to="/create-campaign"
            className="mt-4 md:mt-0 bg-white text-blue-600 px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors"
          >
            ➕ Create New Campaign
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">My Campaigns</p>
              <p className="text-3xl font-bold text-gray-800">{myCampaigns.length}</p>
            </div>
            <span className="text-4xl">📋</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Raised</p>
              <p className="text-3xl font-bold text-green-600">${totalRaised.toLocaleString()}</p>
            </div>
            <span className="text-4xl">💰</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-pink-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">My Donations</p>
              <p className="text-3xl font-bold text-gray-800">{myDonations.length}</p>
            </div>
            <span className="text-4xl">💝</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Donated</p>
              <p className="text-3xl font-bold text-blue-600">${totalDonated.toLocaleString()}</p>
            </div>
            <span className="text-4xl">🎁</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* My Campaigns */}
        <div className="bg-white rounded-3xl shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <span>📋</span> My Campaigns
          </h2>
          
          {myCampaigns.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <div className="text-5xl mb-4">😔</div>
              <p className="text-xl text-gray-600 mb-2">No campaigns yet</p>
              <p className="text-gray-500 mb-4">Create your first campaign and start fundraising!</p>
              <Link
                to="/create-campaign"
                className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700"
              >
                Create Campaign
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {myCampaigns.map((campaign) => (
                <div key={campaign._id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                  <div className="flex gap-4">
                    <img
                      src={campaign.imageUrl || 'https://via.placeholder.com/400x200?text=Campaign'}
                      alt={campaign.title}
                      className="w-24 h-24 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-800">{campaign.title}</h3>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          campaign.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {campaign.status}
                        </span>
                        <span>${campaign.raisedAmount || 0} raised</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${Math.min(((campaign.raisedAmount || 0) / (campaign.goalAmount || 1)) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* My Donations */}
        <div className="bg-white rounded-3xl shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <span>💝</span> My Donations
          </h2>
          
          {myDonations.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <div className="text-5xl mb-4">😔</div>
              <p className="text-xl text-gray-600 mb-2">No donations yet</p>
              <p className="text-gray-500">Browse campaigns and make your first donation!</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {myDonations.map((donation) => (
                <div key={donation._id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <Link
                        to={`/campaign/${donation.campaign?._id}`}
                        className="font-bold text-lg text-blue-600 hover:underline"
                      >
                        {donation.campaign?.title || 'Campaign'}
                      </Link>
                      {donation.message && (
                        <p className="text-gray-600 mt-1 italic">"{donation.message}"</p>
                      )}
                    </div>
                    <span className="text-xl font-bold text-green-600">
                      ${donation.amount.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    {new Date(donation.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
