import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { setIsAuthenticated, setUserRole, setUserId } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showSuccessPopup, setShowSuccessPopup] = useState(false); // State for success popup
  const backendHost = process.env.REACT_APP_BACKEND_HOST;
  useEffect(() => {
    document.title = 'Client Login';
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    try {
      const response = await fetch(`${backendHost}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, role: 'client' }),
      });

      const data = await response.json();

      if (response.ok) {
        const { token } = data;
        localStorage.setItem('token', token);
        const userData = JSON.parse(atob(token.split('.')[1]));
        setUserRole(userData.role);
        setIsAuthenticated(true);
        setUserId(userData.id);

        // Show success popup
        setShowSuccessPopup(true);
        setTimeout(() => {
          setShowSuccessPopup(false);
          navigate('/home'); // Redirect to home page after popup
        }, 2000); // Popup duration
      } else {
        setErrorMessage(data.message || 'Invalid email or password.');
      }
    } catch (error) {
      setErrorMessage('An error occurred during login. Please try again.');
    }
  };

  return (
      <div
          className="min-h-screen flex items-center justify-center bg-cover bg-center"
          style={{
            backgroundImage: 'url("https://source.unsplash.com/1600x900/?baking")',
          }}
      >
        {showSuccessPopup && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white p-6 rounded-md shadow-md text-center">
                <h2 className="text-2xl font-bold mb-4">Login Successful!</h2>
                <p className="text-sm text-gray-600">You will be redirected shortly.</p>
              </div>
            </div>
        )}
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-800">Client Login</h2>
            <p className="mt-2 text-sm text-gray-600">Welcome back to our community</p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div className="space-y-4">
              <input
                  id="email"
                  type="email"
                  placeholder="Email address"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
              />
              <input
                  id="password"
                  type="password"
                  placeholder="Password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
              />
            </div>
            {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}
            <button
                type="submit"
                className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 focus:ring-2 focus:ring-offset-2 focus:ring-black"
            >
              Sign In
            </button>
          </form>
          <p className="mt-4 text-sm text-center text-gray-600">
            Don't have an account?{' '}
            <button
                onClick={() => navigate('/signup')}
                className="text-black hover:underline"
            >
              Sign Up
            </button>
          </p>
        </div>
      </div>
  );
}
