import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

function CustomOrderPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { bakeryId, bakeryName } = location.state || {}; // Get bakeryId and bakeryName from state
    const { addToCart } = useCart();

    const [customOrder, setCustomOrder] = useState({
        weight: '',
        productType: '',
        ingredients: '',
        description: '',
        coatingPreferences: '',
    });

    const [notification, setNotification] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCustomOrder((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddToCart = () => {
        if (
            !customOrder.weight ||
            !customOrder.productType ||
            !customOrder.ingredients ||
            !customOrder.description
        ) {
            showNotification('Please fill in all the required fields.');
            return;
        }

        // Construct notes field with custom details
        const customNotes = JSON.stringify({
            weight: customOrder.weight,
            productType: customOrder.productType,
            ingredients: customOrder.ingredients,
            description: customOrder.description,
            coatingPreferences: customOrder.coatingPreferences,
        });

        const customCartItem = {
            id: 'custom',
            name: `Custom ${customOrder.productType}`,
            price: 0,
            quantity: 1,
            notes: customNotes, // Include custom order details in notes
        };

        addToCart(customCartItem, bakeryId, bakeryName || 'Custom Orders');
        showNotification('Custom order added to cart!');
        navigate('/cart');
    };

    const showNotification = (message) => {
        setNotification(message);
        setTimeout(() => {
            setNotification(null);
        }, 3000);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            {notification && (
                <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-black text-white px-6 py-3 rounded-md shadow-lg z-50">
                    {notification}
                </div>
            )}

            <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
                Place a Custom Order {bakeryName && `at ${bakeryName}`}
            </h1>

            <div className="bg-gray-100 p-6 rounded-lg shadow-lg max-w-3xl mx-auto">
                <div className="space-y-6">
                    {/* Expected Weight */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Expected Weight (in grams)
                        </label>
                        <input
                            type="number"
                            name="weight"
                            value={customOrder.weight}
                            onChange={handleInputChange}
                            placeholder="Enter weight"
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
                        />
                    </div>

                    {/* Type of Product */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Product Type
                        </label>
                        <input
                            type="text"
                            name="productType"
                            value={customOrder.productType}
                            onChange={handleInputChange}
                            placeholder="Enter product type (e.g., Cake, Pastry)"
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
                        />
                    </div>

                    {/* Preferred Ingredients */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Preferred Ingredients
                        </label>
                        <textarea
                            name="ingredients"
                            value={customOrder.ingredients}
                            onChange={handleInputChange}
                            placeholder="List preferred ingredients (e.g., Chocolate, Vanilla)"
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
                        />
                    </div>

                    {/* Full Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Full Description
                        </label>
                        <textarea
                            name="description"
                            value={customOrder.description}
                            onChange={handleInputChange}
                            placeholder="Describe the product you want"
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
                        />
                    </div>

                    {/* Coating Preferences */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Coating Preferences
                        </label>
                        <input
                            type="text"
                            name="coatingPreferences"
                            value={customOrder.coatingPreferences}
                            onChange={handleInputChange}
                            placeholder="Enter preferences for coating (e.g., Chocolate glaze)"
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
                        />
                    </div>
                </div>

                <div className="mt-8 flex justify-end gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleAddToCart}
                        className="bg-gray-800 text-white py-2 px-4 rounded-md hover:bg-gray-700"
                    >
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CustomOrderPage;

