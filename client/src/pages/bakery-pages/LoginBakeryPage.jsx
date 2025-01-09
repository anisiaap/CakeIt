import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function LoginBakeryPage() {
    const navigate = useNavigate();
    const { setIsAuthenticated, setUserRole, setUserId } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [showSuccessPopup, setShowSuccessPopup] = useState(false); // State for success popup

    useEffect(() => {
        document.title = 'Bakery Login';
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();

        console.log("Login attempt initiated");

        if (!email || !password) {
            console.warn("Email or password is missing");
            setErrorMessage('Please enter both email and password.');
            return;
        }

        try {
            console.log("Sending login request to the backend...");
            const response = await fetch('http://localhost:5001/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password, role: 'bakery' }),
            });

            console.log("Response received from backend:", response);

            const data = await response.json();
            console.log("Parsed response data:", data);

            if (response.ok) {
                console.log("Login successful, processing token...");
                const { token } = data;
                console.log("Token received:", token);

                localStorage.setItem('token', token);

                console.log("Token stored in localStorage");

                // Decode role from token payload
                const decodedPayload = atob(token.split('.')[1]);
                console.log("Decoded token payload:", decodedPayload);

                const userData = JSON.parse(decodedPayload); // Decode JWT payload
                console.log("User data extracted from token:", userData);

                setUserRole(userData.role); // Example: 'bakery' or 'client'
                setIsAuthenticated(true);
                setUserId(userData.id);

                // Show success popup
                setShowSuccessPopup(true);
                setTimeout(() => {
                    setShowSuccessPopup(false);
                    navigate('/home-bakery'); // Redirect to home page after popup
                }, 2000); // Popup duration
            } else {
                console.warn("Login failed:", data.message);
                setErrorMessage(data.message || 'Invalid email or password.');
            }
        } catch (error) {
            console.error("Error occurred during login:", error);
            setErrorMessage('An error occurred during login. Please try again.');
        }
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center bg-cover bg-center"
            style={{
                backgroundImage: 'url("https://source.unsplash.com/1600x900/?bakery")',
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
                    <h2 className="text-3xl font-bold text-gray-800">Bakery Login</h2>
                    <p className="mt-2 text-sm text-gray-600">Welcome back to your bakery account</p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                    <div className="space-y-4">
                        <input
                            id="email"
                            type="email"
                            placeholder="Email address"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <input
                            id="password"
                            type="password"
                            placeholder="Password"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}
                    <button
                        type="submit"
                        className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800"
                    >
                        Sign In
                    </button>
                </form>
                <p className="mt-4 text-sm text-center text-gray-600">
                    Don't have an account?{' '}
                    <button
                        onClick={() => navigate('/add-bakery')}
                        className="text-black hover:underline"
                    >
                        Sign Up
                    </button>
                </p>
            </div>
        </div>
    );
}
