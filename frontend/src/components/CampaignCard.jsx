import { Link } from 'react-router-dom'

const CampaignCard = ({ campaign }) => {
  const progress = (campaign.raisedAmount / campaign.goalAmount) * 100

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100">
      <div className="relative">
        <img
          src={campaign.imageUrl}
          alt={campaign.title}
          className="w-full h-56 object-cover"
        />
        <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
          🎯 Active
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2 text-gray-800 hover:text-blue-600 transition-colors line-clamp-1">
          {campaign.title}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {campaign.description}
        </p>
        
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-green-600 font-bold text-lg">
              ${campaign.raisedAmount.toLocaleString()}
            </span>
            <span className="text-gray-500 font-medium">
              of ${campaign.goalAmount.toLocaleString()}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-blue-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(progress, 100)}%` }}
            ></div>
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span className="font-semibold text-green-600">{progress.toFixed(1)}% funded</span>
            <span>🎉 {Math.floor(progress / 10)} backers</span>
          </div>
        </div>

        <div className="flex gap-2">
          <Link
            to={`/campaign/${campaign._id}`}
            className="flex-1 block text-center bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition-all duration-300 font-semibold"
          >
            View Details →
          </Link>
        </div>
      </div>
    </div>
  )
}

export default CampaignCard
