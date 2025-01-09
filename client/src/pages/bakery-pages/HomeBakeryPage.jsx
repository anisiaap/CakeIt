import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

function HomeBakeryPage() {
    const { userId } = useAuth(); // Get userId from AuthContext
    const [bakery, setBakery] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editMode, setEditMode] = useState(false); // Toggle edit mode
    const [updatedData, setUpdatedData] = useState({}); // Store updated bakery data
    const [file, setFile] = useState(null); // For profile picture upload
    const backendHost = process.env.REACT_APP_BACKEND_HOST;

    const fetchBakeryDetails = async () => {
        const token = localStorage.getItem('token');
        if (!token || !userId) {
            setError('Authentication or bakery ID is missing.');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`${backendHost}/api/bakeries/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch bakery details: ${response.statusText}`);
            }

            const data = await response.json();
            setBakery(data);
            setUpdatedData(data); // Initialize form data for editing
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBakeryDetails();
    }, [userId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdatedData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('token');
        if (!token) {
            setError('Authentication is missing.');
            return;
        }

        try {
            const formData = new FormData();
            formData.append('name', updatedData.name);
            formData.append('location', updatedData.location);
            formData.append('description', updatedData.description);
            formData.append('email', updatedData.email);
            formData.append('rating', updatedData.rating || 0);
            if (file) {
                formData.append('imageUrl', file); // Add image if uploaded
            }

            const response = await fetch(`${backendHost}/api/bakeries/${userId}`, {
                method: 'PUT',
                headers: { Authorization: `Bearer ${token}` },
                body: formData, // Send form data with updated bakery info
            });

            if (!response.ok) {
                throw new Error('Failed to update bakery details');
            }

            // Re-fetch bakery details to ensure updated data consistency
            await fetchBakeryDetails();
            setEditMode(false); // Exit edit mode
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) return <div className="text-center py-8">Loading...</div>;
    if (error) return <div className="text-center py-8 text-red-500">Error: {error}</div>;

    if (!bakery) {
        return <div className="text-center py-8">Bakery not found.</div>;
    }

    return (
        <div className="min-h-screen bg-white text-black">
            {/* Bakery Banner */}
            {bakery.imageUrl && (
                <div
                    className="relative h-96 bg-cover bg-center mb-8"
                    style={{ backgroundImage: `url(${bakery.imageUrl})` }}
                >
                    <div className="absolute inset-0 bg-black bg-opacity-50"></div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white">
                        <h1 className="text-5xl font-bold mb-4">{bakery.name}</h1>
                        <p className="text-lg">{bakery.location}</p>
                    </div>
                </div>
            )}

            {/* Bakery Details */}
            <div className="max-w-4xl mx-auto p-8 bg-gray-100 rounded-lg shadow-lg">
                {editMode ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium">Name</label>
                            <input
                                type="text"
                                name="name"
                                value={updatedData.name}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-md p-2"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Location</label>
                            <input
                                type="text"
                                name="location"
                                value={updatedData.location}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-md p-2"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Description</label>
                            <textarea
                                name="description"
                                value={updatedData.description}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-md p-2"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={updatedData.email}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-md p-2"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Rating</label>
                            <input
                                type="number"
                                name="rating"
                                value={updatedData.rating}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-md p-2"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Profile Picture</label>
                            <input
                                type="file"
                                onChange={handleFileChange}
                                className="w-full border border-gray-300 rounded-md p-2"
                            />
                        </div>
                        <div className="flex gap-4">
                            <button
                                type="submit"
                                className="bg-black text-white py-2 px-4 rounded hover:bg-gray-800"
                            >
                                Save Changes
                            </button>
                            <button
                                type="button"
                                onClick={() => setEditMode(false)}
                                className="bg-gray-200 text-black border border-gray-400 py-2 px-4 rounded hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="space-y-4 text-center">
                        <p className="text-lg">
                            <strong className="block text-sm font-medium">Description:</strong>
                            {bakery.description}
                        </p>
                        <p className="text-lg">
                            <strong className="block text-sm font-medium">Email:</strong>
                            {bakery.email}
                        </p>
                        <p className="text-lg">
                            <strong className="block text-sm font-medium">Rating:</strong>
                            {bakery.rating || 'No rating available'}
                        </p>
                        <button
                            onClick={() => setEditMode(true)}
                            className="bg-black text-white py-2 px-4 rounded hover:bg-gray-800"
                        >
                            Edit Profile
                        </button>
                    </div>
                )}
            </div>

            {/* Products Section */}
            <h2 className="text-3xl font-bold mt-12 mb-6 text-center">Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-8">
                {bakery.products.map((product) => (
                    <div key={product._id} className="bg-white p-4 rounded shadow-md">
                        <img
                            src={product.image || '/fallback-image.jpg'}
                            alt={product.name}
                            className="h-48 w-full object-cover rounded mb-4"
                        />
                        <h3 className="font-bold text-lg">{product.name}</h3>
                        <p className="text-gray-700">{product.description}</p>
                        <p className="mt-2 font-semibold">{product.price} RON</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default HomeBakeryPage;
