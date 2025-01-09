import React, { useState } from 'react';

export default function AddBakery() {
    const [formData, setFormData] = useState({
        id: '',
        name: '',
        location: '',
        description: '',
        rating: '',
        imageUrl: '',
        products: [],
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:5001/api/addbakeries', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const data = await response.json();
                alert('Bakery added successfully!');
                console.log('Added bakery:', data);
            } else {
                alert('Failed to add bakery');
                console.error('Error adding bakery:', await response.json());
            }
        } catch (err) {
            console.error('Error submitting form:', err);
        }
    };

    return (
        <View style="container mx-auto px-4 py-8">
            <h1 style="text-2xl font-bold mb-6">Add a New Bakery</h1>
            <form onSubmit={handleSubmit} style="space-y-4">
                <View>
                    <label htmlFor="id" style="block text-sm font-medium">ID:</label>
                    <input
                        type="number"
                        id="id"
                        name="id"
                        value={formData.id}
                        onChange={handleChange}
                        style="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
                        required
                    />
                </View>
                <View>
                    <label htmlFor="name" style="block text-sm font-medium">Name:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        style="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
                        required
                    />
                </View>
                <View>
                    <label htmlFor="location" style="block text-sm font-medium">Location:</label>
                    <input
                        type="text"
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        style="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
                    />
                </View>
                <View>
                    <label htmlFor="description" style="block text-sm font-medium">Description:</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        style="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
                    />
                </View>
                <View>
                    <label htmlFor="rating" style="block text-sm font-medium">Rating:</label>
                    <input
                        type="number"
                        id="rating"
                        name="rating"
                        step="0.1"
                        value={formData.rating}
                        onChange={handleChange}
                        style="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
                    />
                </View>
                <View>
                    <label htmlFor="imageUrl" style="block text-sm font-medium">Image URL:</label>
                    <input
                        type="text"
                        id="imageUrl"
                        name="imageUrl"
                        value={formData.imageUrl}
                        onChange={handleChange}
                        style="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
                    />
                </View>
                <button
                    type="submit"
                    style="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                >
                    Add Bakery
                </button>
            </form>
        </View>
    );
}