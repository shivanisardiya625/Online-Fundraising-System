import { Link } from 'react-router-dom'
import { useContext, useState } from 'react'
import { AuthContext } from '../context/AuthContext'

const Navbar = () => {
  const { user, logout } = useContext(AuthContext)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <span>FundRaiser</span>
          </Link>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="hover:text-blue-200 transition-all duration-300 font-medium text-lg">
              🏠 Home
            </Link>
            {user ? (
              <>
                <Link to="/dashboard" className="hover:text-blue-200 transition-all duration-300 font-medium text-lg">
                  📊 Dashboard
                </Link>
                <Link to="/create-campaign" className="hover:text-blue-200 transition-all duration-300 font-medium text-lg">
                  ➕ Create Campaign
                </Link>
                <button
                  onClick={logout}
                  className="bg-red-500 hover:bg-red-600 px-6 py-2 rounded-full font-semibold transition-all duration-300"
                >
                  🚪 Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-blue-200 transition-all duration-300 font-medium text-lg">
                  🔐 Login
                </Link>
                <Link
                  to="/register"
                  className="bg-white text-blue-600 hover:bg-gray-100 px-6 py-2 rounded-full font-semibold transition-all duration-300"
                >
                  📝 Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-white text-2xl"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 space-y-3">
            <Link to="/" className="block hover:text-blue-200 py-2 text-lg">
              🏠 Home
            </Link>
            {user ? (
              <>
                <Link to="/dashboard" className="block hover:text-blue-200 py-2 text-lg">
                  📊 Dashboard
                </Link>
                <Link to="/create-campaign" className="block hover:text-blue-200 py-2 text-lg">
                  ➕ Create Campaign
                </Link>
                <button
                  onClick={logout}
                  className="w-full bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg font-semibold"
                >
                  🚪 Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block hover:text-blue-200 py-2 text-lg">
                  🔐 Login
                </Link>
                <Link to="/register" className="block bg-white text-blue-600 text-center px-4 py-2 rounded-lg font-semibold">
                  📝 Register
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
