import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo_git.png';

export default function NavBar() {
  const { isAuthenticated, setIsAuthenticated, setUserRole, setUserId, userRole } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('token'); // Clear stored token
    setUserRole(null);
    setUserId(null);
    navigate('/');
  };

  return (
      <nav className="bg-white text-black shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center">
                <img src={logo} alt="Logo" className="w-10 h-10 mr-2" />
                <span className="font-bold text-xl text-black">CakeIT</span>
              </Link>
            </div>
            <div className="md:hidden">
              {/* Mobile menu toggle button */}
              <button
                  className="text-black hover:text-gray-700 focus:outline-none"
                  onClick={() => {
                    const menu = document.getElementById('mobile-menu');
                    menu.classList.toggle('hidden');
                  }}
              >
                <svg
                    className="w-6 h-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                  <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16m-7 6h7"
                  />
                </svg>
              </button>
            </div>
            <div className="hidden md:flex">
              <NavItems
                  isAuthenticated={isAuthenticated}
                  userRole={userRole}
                  handleLogout={handleLogout}
              />
            </div>
          </div>
        </div>
        {/* Mobile menu */}
        <div id="mobile-menu" className="md:hidden hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <NavItems
                isAuthenticated={isAuthenticated}
                userRole={userRole}
                handleLogout={handleLogout}
            />
          </div>
        </div>
      </nav>
  );
}

function NavItems({ isAuthenticated, userRole, handleLogout }) {
  return isAuthenticated ? (
      <>
        {userRole === 'bakery' ? (
            <>
              <NavLink to="/home-bakery">Home</NavLink>
              <NavLink to="/orders-bakery">Orders</NavLink>
              <NavLink to="/add-product">Add Product</NavLink>
              <NavLink to="/products-bakery">Products List</NavLink>
            </>
        ) : (
            <>
              <NavLink to="/home">Bakeries</NavLink>
              <NavLink to="/cart">My Cart</NavLink>
              <NavLink to="/profile">My Profile</NavLink>
            </>
        )}
        <button
            onClick={handleLogout}
            className="block text-black hover:bg-gray-200 px-3 py-2 rounded-md text-sm font-medium"
        >
          Logout
        </button>
      </>
  ) : (
      <>
        <NavLink to="/">Welcome</NavLink>
        <NavLink to="/login">Login</NavLink>
        <NavLink to="/signup">Sign Up</NavLink>
      </>
  );
}

function NavLink({ to, children }) {
  return (
      <Link
          to={to}
          className="block text-black hover:bg-gray-200 px-3 py-2 rounded-md text-sm font-medium"
      >
        {children}
      </Link>
  );
}
