import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AddProductPage() {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        ingredients: '',
        price: '',
        weight: '',
        availability: true,
        stock: 0,
        image: null, // File for the product image
    });

    const [showConfirmation, setShowConfirmation] = useState(false); // Confirmation popup state
    const navigate = useNavigate();
    const backendHost = process.env.REACT_APP_BACKEND_HOST;

    // Handle input changes
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    // Handle file input changes
    const handleFileChange = (e) => {
        setFormData((prevData) => ({
            ...prevData,
            image: e.target.files[0], // File object
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        const productData = new FormData();
        productData.append('name', formData.name);
        productData.append('description', formData.description);
        productData.append('ingredients', formData.ingredients);
        productData.append('price', formData.price);
        productData.append('weight', formData.weight);
        productData.append('availability', formData.availability);
        productData.append('stock', formData.stock);
        productData.append('image', formData.image); // Append image file

        try {
            const response = await fetch(`${backendHost}/api/products`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`, // Add token for authentication
                },
                body: productData,
            });

            if (response.ok) {
                setShowConfirmation(true);
                setTimeout(() => {
                    setShowConfirmation(false);
                    navigate('/home-bakery'); // Redirect to product list
                }, 2000);
            } else {
                const errorData = await response.json();
                console.error('Error:', errorData);
                alert(`Error: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Error adding product:', error);
            alert('An error occurred. Please try again.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            {/* Confirmation Popup */}
            {showConfirmation && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-md shadow-md text-center">
                        <h2 className="text-2xl font-bold mb-4">Product Added Successfully!</h2>
                        <p className="text-sm text-gray-600">You will be redirected shortly.</p>
                    </div>
                </div>
            )}
            {/* Form */}
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg">
                <h1 className="text-3xl font-bold mb-6 text-center">Add New Product</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Product Name */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Product Name:
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black"
                            placeholder="Enter product name"
                            required
                        />
                    </div>
                    {/* Description */}
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                            Description:
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black"
                            placeholder="Enter product description"
                        />
                    </div>
                    {/* Ingredients */}
                    <div>
                        <label htmlFor="ingredients" className="block text-sm font-medium text-gray-700">
                            Ingredients:
                        </label>
                        <textarea
                            id="ingredients"
                            name="ingredients"
                            value={formData.ingredients}
                            onChange={handleChange}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black"
                            placeholder="Enter product ingredients"
                        />
                    </div>
                    {/* Price */}
                    <div>
                        <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                            Price:
                        </label>
                        <input
                            type="number"
                            id="price"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black"
                            placeholder="Enter price"
                            required
                        />
                    </div>
                    {/* Weight */}
                    <div>
                        <label htmlFor="weight" className="block text-sm font-medium text-gray-700">
                            Weight (grams):
                        </label>
                        <input
                            type="number"
                            id="weight"
                            name="weight"
                            value={formData.weight}
                            onChange={handleChange}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black"
                            placeholder="Enter weight in grams"
                            required
                        />
                    </div>
                    {/* Stock */}
                    <div>
                        <label htmlFor="stock" className="block text-sm font-medium text-gray-700">
                            Stock Quantity:
                        </label>
                        <input
                            type="number"
                            id="stock"
                            name="stock"
                            value={formData.stock}
                            onChange={handleChange}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black"
                            placeholder="Enter stock quantity"
                        />
                    </div>
                    {/* Image */}
                    <div>
                        <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                            Product Image:
                        </label>
                        <input
                            type="file"
                            id="image"
                            name="image"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black"
                        />
                    </div>
                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 focus:ring-2 focus:ring-offset-2 focus:ring-black"
                    >
                        Add Product
                    </button>
                </form>
            </div>
        </div>
    );
}
