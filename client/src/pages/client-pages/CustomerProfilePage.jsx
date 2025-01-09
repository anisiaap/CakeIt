import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function CustomerProfilePage() {
    const navigate = useNavigate();
    const { userId } = useAuth(); // Get userId from AuthContext
    const [user, setUser] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editDetails, setEditDetails] = useState({});
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState(null); // Track order for cancellation
    const backendHost = process.env.REACT_APP_BACKEND_HOST;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');

                // Fetch user data
                const userResponse = await fetch(`${backendHost}/api/clients/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!userResponse.ok) throw new Error('Failed to fetch user data');
                const userData = await userResponse.json();
                setUser(userData);
                setEditDetails(userData);

                // Fetch orders
                const ordersResponse = await fetch(`${backendHost}/api/orders/client`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!ordersResponse.ok) throw new Error('Failed to fetch orders');
                const ordersData = await ordersResponse.json();

                // Map and transform orders to handle custom orders
                const transformedOrders = ordersData.map((order) => ({
                    ...order,
                    products: order.products.map((product) =>
                        product.productId === 'custom'
                            ? { ...product, name: `Custom Order: ${product.customDetails?.productType || ''}` }
                            : product
                    ),
                }));

                setOrders(transformedOrders);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchData();
        }
    }, [userId]);

    const handleCancelOrder = async () => {
        if (!selectedOrderId) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${backendHost}/api/orders/${selectedOrderId}/cancel`, {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) throw new Error('Failed to cancel order');

            // Update the state to reflect the canceled order
            const updatedOrders = orders.map((order) =>
                order._id === selectedOrderId ? { ...order, status: 'declined' } : order
            );
            setOrders(updatedOrders);

            // Close modal and reset selection
            setShowCancelModal(false);
            setSelectedOrderId(null);
        } catch (err) {
            console.error('Error canceling order:', err);
        }
    };

    const confirmCancelOrder = (orderId) => {
        setSelectedOrderId(orderId); // Set order ID for cancellation
        setShowCancelModal(true); // Show the confirmation modal
    };

    const handleEditSubmit = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${backendHost}/api/clients/${userId}`, {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editDetails),
            });
            if (!response.ok) throw new Error('Failed to update profile');
            const updatedUser = await response.json();
            setUser(updatedUser);
            setIsEditing(false);
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <div className="text-center py-8">Loading...</div>;
    if (error) return <div className="text-center py-8 text-red-500">Error: {error}</div>;

    const activeOrders = orders.filter(
        (order) => order.status !== 'completed' && order.status !== 'declined'
    );
    const pastOrders = orders.filter(
        (order) => order.status === 'completed' || order.status === 'declined'
    );

    return (
        <div className="min-h-screen bg-white text-black p-8">
            <h1 className="text-3xl font-bold mb-6">Customer Profile</h1>
            <div className="flex flex-col md:flex-row gap-8">
                {/* Profile Details */}
                <div className="w-full md:w-1/3 bg-gray-100 p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold mb-4">Profile Details</h2>
                    {!isEditing ? (
                        <div className="space-y-2">
                            <p><strong>Username:</strong> {user.username}</p>
                            <p><strong>First Name:</strong> {user.firstName}</p>
                            <p><strong>Last Name:</strong> {user.lastName}</p>
                            <p><strong>Email:</strong> {user.email}</p>
                            <p><strong>Phone:</strong> {user.phone}</p>
                            <p><strong>Address:</strong> {user.address}</p>
                            <button
                                className="mt-4 bg-white text-black border border-gray-300 py-2 px-4 rounded hover:bg-gray-100"
                                onClick={() => setIsEditing(true)}
                            >
                                Edit Details
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <input
                                type="text"
                                value={editDetails.username}
                                onChange={(e) =>
                                    setEditDetails({ ...editDetails, username: e.target.value })
                                }
                                placeholder="Username"
                                className="w-full px-4 py-2 border rounded"
                            />
                            <input
                                type="text"
                                value={editDetails.firstName}
                                onChange={(e) =>
                                    setEditDetails({ ...editDetails, firstName: e.target.value })
                                }
                                placeholder="First Name"
                                className="w-full px-4 py-2 border rounded"
                            />
                            <input
                                type="text"
                                value={editDetails.lastName}
                                onChange={(e) =>
                                    setEditDetails({ ...editDetails, lastName: e.target.value })
                                }
                                placeholder="Last Name"
                                className="w-full px-4 py-2 border rounded"
                            />
                            <input
                                type="text"
                                value={editDetails.phone}
                                onChange={(e) =>
                                    setEditDetails({ ...editDetails, phone: e.target.value })
                                }
                                placeholder="Phone"
                                className="w-full px-4 py-2 border rounded"
                            />
                            <input
                                type="text"
                                value={editDetails.address}
                                onChange={(e) =>
                                    setEditDetails({ ...editDetails, address: e.target.value })
                                }
                                placeholder="Address"
                                className="w-full px-4 py-2 border rounded"
                            />
                            <div className="flex gap-2 mt-4">
                                <button
                                    className="bg-black text-white py-2 px-4 rounded"
                                    onClick={handleEditSubmit}
                                >
                                    Save
                                </button>
                                <button
                                    className="bg-white text-red-500 border border-gray-300 py-2 px-4 rounded hover:bg-gray-100"
                                    onClick={() => setIsEditing(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Active Orders */}
                <div className="w-full md:w-2/3 bg-gray-100 p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Active Orders</h2>
                    <OrderTable
                        orders={activeOrders}
                        onCancel={confirmCancelOrder}
                        navigate={navigate}
                        showCancel
                    />
                </div>
            </div>

            {/* Past Orders */}
            <div className="bg-gray-100 p-6 rounded-lg shadow-md mt-8">
                <h2 className="text-xl font-semibold mb-4">Past Orders</h2>
                <OrderTable orders={pastOrders} navigate={navigate} />
            </div>

            {/* Cancel Confirmation Modal */}
            {showCancelModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm">
                        <h2 className="text-lg font-bold mb-4">Are you sure?</h2>
                        <p className="text-sm text-gray-600 mb-6">
                            Do you really want to cancel this order? This action cannot be undone.
                        </p>
                        <div className="flex justify-between">
                            <button
                                className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
                                onClick={() => setShowCancelModal(false)}
                            >
                                No
                            </button>
                            <button
                                className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
                                onClick={handleCancelOrder}
                            >
                                Yes, Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
function OrderTable({ orders, onCancel, navigate, showCancel }) {
    return orders.length > 0 ? (
        <table className="w-full border-collapse border border-gray-300">
            <thead>
            <tr className="bg-gray-200">
                <th className="border border-gray-300 px-4 py-2">Order ID</th>
                <th className="border border-gray-300 px-4 py-2">Order Date</th>
                <th className="border border-gray-300 px-4 py-2">Delivery Date & Time</th>
                <th className="border border-gray-300 px-4 py-2">Total (RON)</th>
                <th className="border border-gray-300 px-4 py-2">Status</th>
                <th className="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
            </thead>
            <tbody>
            {orders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-100">
                    <td className="border border-gray-300 px-4 py-2 text-center">{order._id}</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                        {new Date(order.orderDate).toLocaleString([], {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                        })} {/* Format Order Date */}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                        {order.deliveryDate
                            ? new Date(order.deliveryDate).toLocaleString([], {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit',
                            }) // Format Delivery Date & Hour
                            : 'N/A'}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                        {order.totalPrice.toFixed(2)} RON
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-center">{order.status}</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                        <button
                            className="bg-white text-black border border-gray-300 py-1 px-3 rounded hover:bg-gray-100"
                            onClick={() => navigate(`/order/${order._id}`)}
                        >
                            Details
                        </button>
                        {showCancel && order.status === 'pending' && (
                            <button
                                className="bg-white text-red-500 border border-gray-300 py-1 px-3 rounded hover:bg-gray-100"
                                onClick={() => onCancel(order._id)}
                            >
                                Cancel
                            </button>
                        )}
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    ) : (
        <p className="text-center text-gray-600">No orders available.</p>
    );
}
