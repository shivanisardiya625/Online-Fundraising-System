import { useState, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import API_BASE from '../config/api'

const CreateCampaign = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    goalAmount: '',
    imageUrl: '',
    deadline: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { token } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch(`${API_BASE}/api/campaigns`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          goalAmount: Number(formData.goalAmount)
        })
      })

      const data = await res.json()

      if (res.ok) {
        navigate('/dashboard')
      } else {
        setError(data.message)
      }
    } catch (error) {
      setError('Something went wrong')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="absolute inset-0 bg-blue-600 -z-10"></div>
      
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🎯</div>
            <h2 className="text-4xl font-bold text-gray-800">
              Create Campaign
            </h2>
            <p className="text-gray-600 mt-2">Start your fundraising journey today</p>
          </div>

          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">📌 Campaign Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                placeholder="Enter campaign title"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">📝 Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors h-40"
                placeholder="Describe your campaign..."
                required
              ></textarea>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">💰 Goal Amount ($)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  name="goalAmount"
                  value={formData.goalAmount}
                  onChange={handleChange}
                  className="w-full pl-8 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                  placeholder="Enter goal amount"
                  required
                  min="1"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">🖼️ Image URL</label>
              <input
                type="url"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                placeholder="https://example.com/image.jpg"
              />
              <p className="text-xs text-gray-500 mt-1">Paste an image URL for your campaign</p>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">📅 Deadline</label>
              <input
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin">⏳</span> Creating campaign...
                </span>
              ) : (
                '🚀 Launch Campaign'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CreateCampaign
