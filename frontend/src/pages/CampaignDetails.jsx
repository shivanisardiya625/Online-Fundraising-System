import { useState, useEffect, useContext } from 'react'
import { useParams } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import API_BASE from '../config/api'

const CampaignDetails = () => {
  const { id } = useParams()
  const [campaign, setCampaign] = useState(null)
  const [donations, setDonations] = useState([])
  const [loading, setLoading] = useState(true)
  const [donateAmount, setDonateAmount] = useState('')
  const [donateMessage, setDonateMessage] = useState('')
  const [donating, setDonating] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const { user, token } = useContext(AuthContext)

  useEffect(() => {
    fetchCampaign()
  }, [id])

  const fetchCampaign = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/campaigns/${id}`)
      const data = await res.json()
      setCampaign(data.campaign)
      setDonations(data.donations || [])
    } catch (error) {
      console.error('Error fetching campaign:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDonate = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setDonating(true)

    if (!user) {
      setError('Please login to donate')
      setDonating(false)
      return
    }

    try {
      const res = await fetch(`${API_BASE}/api/donations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          campaignId: id,
          amount: Number(donateAmount),
          message: donateMessage
        })
      })

      const data = await res.json()

      if (res.ok) {
        setSuccess('Thank you for your generous donation! 🎉')
        setDonateAmount('')
        setDonateMessage('')
        fetchCampaign()
      } else {
        setError(data.message)
      }
    } catch (error) {
      setError('Something went wrong')
    }
    setDonating(false)
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this campaign?')) return

    try {
      const res = await fetch(`${API_BASE}/api/campaigns/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (res.ok) {
        window.location.href = '/dashboard'
      }
    } catch (error) {
      console.error('Error deleting campaign:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
          <p className="mt-4 text-xl text-gray-600">Loading campaign...</p>
        </div>
      </div>
    )
  }

  if (!campaign) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😔</div>
          <p className="text-2xl text-gray-600">Campaign not found</p>
        </div>
      </div>
    )
  }

  const progress = (campaign.raisedAmount / campaign.goalAmount) * 100

  return (
    <div className="max-w-5xl mx-auto">
      {/* Hero Image */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl mb-8">
        <img
          src={campaign.imageUrl}
          alt={campaign.title}
          className="w-full h-80 md:h-96 object-cover"
        />
        <div className="absolute bottom-6 left-6 text-white">
          <span className="bg-blue-600 px-4 py-1 rounded-full text-sm font-semibold">
            🎯 {campaign.status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl shadow-lg p-8">
            <h1 className="text-4xl font-bold mb-4 text-gray-800">{campaign.title}</h1>
            <p className="text-gray-600 text-lg leading-relaxed mb-6">{campaign.description}</p>
            
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>👤 {campaign.creator?.name}</span>
              <span>📅 {new Date(campaign.createdAt).toLocaleDateString()}</span>
              <span>⏰ Deadline: {new Date(campaign.deadline).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Recent Donations */}
          <div className="bg-white rounded-3xl shadow-lg p-8">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <span>💝</span> Recent Donations ({donations.length})
            </h3>
            {donations.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-xl">
                <div className="text-5xl mb-3">😔</div>
                <p className="text-gray-500 text-lg">No donations yet</p>
                <p className="text-gray-400">Be the first to donate!</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {donations.map((donation) => (
                  <div key={donation._id} className="border-l-4 border-blue-500 bg-blue-50 pl-4 py-3 rounded-r-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold text-blue-700 text-lg">
                          ${donation.amount.toLocaleString()}
                        </p>
                        <p className="text-gray-700">
                          👤 {donation.donor?.name || 'Anonymous'}
                        </p>
                      </div>
                      <span className="text-gray-400 text-sm">
                        {new Date(donation.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {donation.message && (
                      <p className="text-gray-600 mt-2 italic">"{donation.message}"</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Progress Card */}
          <div className="bg-white rounded-3xl shadow-lg p-6">
            <div className="text-center mb-6">
              <p className="text-5xl font-bold text-blue-600">
                ${campaign.raisedAmount.toLocaleString()}
              </p>
              <p className="text-gray-500">raised of ${campaign.goalAmount.toLocaleString()} goal</p>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-4 mb-4 overflow-hidden">
              <div
                className="bg-blue-600 h-4 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(progress, 100)}%` }}
              ></div>
            </div>

            <div className="flex justify-between text-sm text-gray-600 mb-6">
              <span className="font-semibold">{progress.toFixed(1)}% funded</span>
              <span>🎉 {Math.floor(progress / 10)} backers</span>
            </div>

            {user && user._id === campaign.creator?._id && (
              <button
                onClick={handleDelete}
                className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-semibold transition-colors"
              >
                🗑️ Delete Campaign
              </button>
            )}
          </div>

          {/* Donation Form */}
          {user && (
            <div className="bg-blue-600 rounded-3xl shadow-lg p-6 text-white">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span>💝</span> Make a Donation
              </h3>
              
              {error && (
                <div className="bg-red-500/20 border border-red-300 text-white px-4 py-2 rounded-lg mb-4">
                  ⚠️ {error}
                </div>
              )}

              {success && (
                <div className="bg-green-500/20 border border-green-300 text-white px-4 py-2 rounded-lg mb-4">
                  ✨ {success}
                </div>
              )}

              <form onSubmit={handleDonate}>
                <div className="mb-4">
                  <label className="block text-white/80 font-semibold mb-2">Amount ($)</label>
                  <input
                    type="number"
                    value={donateAmount}
                    onChange={(e) => setDonateAmount(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-white/30 rounded-xl bg-white/10 text-white placeholder-white/50 focus:outline-none focus:border-white transition-colors"
                    placeholder="Enter amount"
                    required
                    min="1"
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-white/80 font-semibold mb-2">Message (optional)</label>
                  <textarea
                    value={donateMessage}
                    onChange={(e) => setDonateMessage(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-white/30 rounded-xl bg-white/10 text-white placeholder-white/50 focus:outline-none focus:border-white transition-colors h-24"
                    placeholder="Leave a message..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={donating}
                  className="w-full bg-white text-blue-600 py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {donating ? '⏳ Processing...' : '💝 Donate Now'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CampaignDetails
