import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function OrderListPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const backendHost = process.env.REACT_APP_BACKEND_HOST;
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch(`${backendHost}/api/orders/bakery`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch orders');
                }
                const data = await response.json();
                setOrders(data);
            } catch (err) {
                console.error('Error fetching orders:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const handleOrderRedirect = (orderId) => {
        navigate(`/bakery/order/${orderId}`);
    };

    // Split orders into active and past categories
    const activeOrders = orders.filter(
        (order) => !['completed', 'declined'].includes(order.status)
    );
    const pastOrders = orders.filter((order) =>
        ['completed', 'declined'].includes(order.status)
    );

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <p className="text-gray-700 text-xl">Loading orders...</p>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <p className="text-gray-700 text-xl">No orders available.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-8">
            <h1 className="text-3xl font-bold mb-10 text-center text-gray-800">
                Orders for Your Bakery
            </h1>

            {/* Active Orders Table */}
            <div className="mb-12">
                <h2 className="text-2xl font-semibold mb-6">Active Orders</h2>
                {activeOrders.length > 0 ? (
                    <OrderTable orders={activeOrders} onRedirect={handleOrderRedirect} />
                ) : (
                    <p className="text-gray-600">No active orders available.</p>
                )}
            </div>

            {/* Past Orders Table */}
            <div>
                <h2 className="text-2xl font-semibold mb-6">Past Orders</h2>
                {pastOrders.length > 0 ? (
                    <OrderTable orders={pastOrders} onRedirect={handleOrderRedirect} />
                ) : (
                    <p className="text-gray-600">No past orders available.</p>
                )}
            </div>
        </div>
    );
}

function OrderTable({ orders, onRedirect }) {
    return (
        <div className="overflow-x-auto">
            <table className="table-auto w-full bg-white shadow rounded-lg border-collapse">
                <thead>
                <tr className="bg-gray-200">
                    <th className="py-2 px-4 text-left text-gray-700 font-medium">Order ID</th>
                    <th className="py-2 px-4 text-left text-gray-700 font-medium">Client</th>
                    <th className="py-2 px-4 text-left text-gray-700 font-medium">Status</th>
                    <th className="py-2 px-4 text-left text-gray-700 font-medium">Total Price</th>
                    <th className="py-2 px-4 text-left text-gray-700 font-medium">Order Date</th>
                    <th className="py-2 px-4 text-left text-gray-700 font-medium">Delivery Date & Time</th>
                    <th className="py-2 px-4 text-left text-gray-700 font-medium">Pickup Option</th>
                    <th className="py-2 px-4 text-left text-gray-700 font-medium">Actions</th>
                </tr>
                </thead>
                <tbody>
                {orders.map((order) => (
                    <tr key={order._id} className="border-b hover:bg-gray-100">
                        <td className="py-2 px-4">{order._id}</td>
                        <td className="py-2 px-4">{order.client?.email || 'Unknown'}</td>
                        <td className="py-2 px-4 capitalize">{order.status}</td>
                        <td className="py-2 px-4">RON {order.totalPrice.toFixed(2)}</td>
                        <td className="py-2 px-4">
                            {new Date(order.orderDate).toLocaleString([], {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit',
                            })}
                        </td>
                        <td className="py-2 px-4">
                            {order.deliveryDate
                                ? new Date(order.deliveryDate).toLocaleString([], {
                                    year: 'numeric',
                                    month: '2-digit',
                                    day: '2-digit',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })
                                : 'N/A'}
                        </td>
                        <td className="py-2 px-4 capitalize">{order.pickupOption.replace('-', ' ')}</td>
                        <td className="py-2 px-4">
                            <button
                                className="bg-gray-800 text-white py-1 px-3 rounded hover:bg-gray-700 transition-all duration-200"
                                onClick={() => onRedirect(order._id)}
                            >
                                Handle Order
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default OrderListPage;
