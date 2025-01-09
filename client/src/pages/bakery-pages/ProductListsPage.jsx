import React, { useState, useEffect } from 'react';

function ProductListsPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showStockModal, setShowStockModal] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState(null);
    const [newStock, setNewStock] = useState("");
    const backendHost = process.env.REACT_APP_BACKEND_HOST;

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await fetch(`${backendHost}/api/products/bakery`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setProducts(data);
                setLoading(false);
            } else {
                console.error('Failed to fetch products.');
            }
        } catch (err) {
            console.error('Error fetching products:', err);
        }
    };

    const handleUpdateStock = async () => {
        try {
            const response = await fetch(`${backendHost}/api/products/${selectedProductId}/stock`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ stock: newStock }),
            });

            if (response.ok) {
                fetchProducts();
                setShowStockModal(false);
            } else {
                console.error('Failed to update stock.');
            }
        } catch (err) {
            console.error('Error updating stock:', err);
        }
    };

    const handleDeleteProduct = async () => {
        try {
            const response = await fetch(`${backendHost}/api/products/${selectedProductId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (response.ok) {
                fetchProducts();
                setShowDeleteModal(false);
            } else {
                console.error('Failed to delete product.');
            }
        } catch (err) {
            console.error('Error deleting product:', err);
        }
    };

    const confirmDelete = (productId) => {
        setSelectedProductId(productId);
        setShowDeleteModal(true);
    };

    const confirmUpdateStock = (productId) => {
        setSelectedProductId(productId);
        setShowStockModal(true);
    };

    if (loading) {
        return <p className="text-center">Loading products...</p>;
    }

    return (
        <div className="min-h-screen p-8 bg-gray-100">
            <h1 className="text-3xl font-bold text-center mb-6">Product Management</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                    <div key={product._id} className="bg-white p-6 rounded-lg shadow-md">
                        <img
                            src={`${backendHost}/uploads/${product.image}` || '/fallback-image.jpg'}
                            alt={product.name}
                            className="h-40 w-full object-cover mb-4 rounded-lg"
                        />
                        <h2 className="text-lg font-bold mb-2">{product.name}</h2>
                        <p className="text-sm text-gray-600 mb-2">{product.description}</p>
                        <p className="text-sm text-gray-600 mb-2">Ingredients: {product.ingredients}</p>
                        <p className="text-sm text-gray-600 mb-2">Price: RON {product.price}</p>
                        <p className="text-sm text-gray-600 mb-2">Weight: {product.weight}g</p>
                        <p className="text-sm text-gray-600 mb-4">Stock: {product.stock}</p>
                        <button
                            className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 mb-2"
                            onClick={() => confirmUpdateStock(product._id)}
                        >
                            Update Stock
                        </button>
                        <button
                            className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800"
                            onClick={() => confirmDelete(product._id)}
                        >
                            Remove Product
                        </button>
                    </div>
                ))}
            </div>

            {/* Update Stock Modal */}
            {showStockModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm">
                        <h2 className="text-lg font-bold mb-4">Update Stock</h2>
                        <input
                            type="number"
                            min="0"
                            placeholder="Enter new stock"
                            value={newStock}
                            onChange={(e) => setNewStock(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded mb-4"
                        />
                        <div className="flex justify-between">
                            <button
                                className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
                                onClick={() => setShowStockModal(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
                                onClick={handleUpdateStock}
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm">
                        <h2 className="text-lg font-bold mb-4">Are you sure?</h2>
                        <p className="text-sm text-gray-600 mb-6">
                            Do you really want to delete this product? This action cannot be undone.
                        </p>
                        <div className="flex justify-between">
                            <button
                                className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
                                onClick={() => setShowDeleteModal(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
                                onClick={handleDeleteProduct}
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ProductListsPage;
