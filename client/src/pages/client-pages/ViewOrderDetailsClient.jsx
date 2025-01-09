import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function ViewOrderDetailsClient() {
    const { orderId } = useParams(); // Get order ID from the route
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [qrCode, setQRCode] = useState(null); // State to store QR code
    const backendHost = process.env.REACT_APP_BACKEND_HOST;

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) throw new Error('Authentication token missing');

                // Fetch order details
                const orderResponse = await fetch(`${backendHost}/api/orders/${orderId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!orderResponse.ok) throw new Error('Failed to fetch order details');
                const orderData = await orderResponse.json();
                setOrder(orderData);

                // If the order has status 'waiting for pickup' and pickup option 'easybox', fetch QR code
                if (orderData.status === 'waiting for pickup' && orderData.pickupOption === 'easybox') {
                    const response = await fetch(`${backendHost}/api/qr/qr/${orderId}`, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                        },
                    });

                    if (response.ok) {
                        const { qrCode } = await response.json();
                        setQRCode(qrCode); // QR code exists, show it
                    } else {
                        console.error('Failed to fetch QR Code:', response.statusText);

                    }
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchOrderDetails();
    }, [orderId]);

    const parseNotes = (notes) => {
        try {
            return JSON.parse(notes);
        } catch {
            return notes;
        }
    };

    if (loading) return <div className="text-center py-8">Loading...</div>;
    if (error) return <div className="text-center py-8 text-red-500">Error: {error}</div>;

    const customDetails = parseNotes(order.notes);

    return (
        <div className="min-h-screen bg-gray-50 text-black p-8">
            <h1 className="text-4xl font-bold mb-6 text-center text-black">Order Details</h1>

            {/* Delivery Date Highlight */}
            <div className="bg-gray-700 text-white text-center py-4 rounded-lg shadow-lg mb-6">
                <h2 className="text-2xl font-bold">Delivery Date</h2>
                <p className="text-lg">{new Date(order.deliveryDate).toLocaleString()}</p>
            </div>

            <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg space-y-6">

                {/* Order and Client Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h3 className="text-xl font-bold text-black mb-2">Order Information</h3>
                        <p><strong>Order ID:</strong> {order._id}</p>
                        <p><strong>Order Date:</strong> {new Date(order.orderDate).toLocaleString()}</p>
                        <p>
                            <strong>Status:</strong>{' '}
                            <span className={`px-2 py-1 rounded ${getStatusClass(order.status)}`}>{order.status}</span>
                        </p>
                        <p><strong>Pickup Option:</strong> {order.pickupOption}</p>
                        {order.pickupOption === 'delivery' && (
                            <p><strong>Delivery Address:</strong> {order.deliveryAddress}</p>
                        )}
                        <p><strong>Transport Cost:</strong> {order.transportCost.toFixed(2)} RON</p>
                        <p><strong>Total Price:</strong> {order.totalPrice.toFixed(2)} RON</p>
                    </div>

                    <div>
                        <h3 className="text-xl font-bold text-black mb-2">Client Information</h3>
                        <p><strong>Email:</strong> {order.clientId?.email || 'Unknown'}</p>
                        <p><strong>Username:</strong> {order.clientId?.username || 'Unknown'}</p>
                    </div>
                </div>

                {/* Notes Section */}
                {order.notes && (
                    <div>
                        <h3 className="text-xl font-bold text-black mb-2">Notes</h3>
                        <div className="bg-gray-100 p-4 rounded-md">
                            {typeof customDetails === 'string' ? (
                                <p>{customDetails}</p>
                            ) : (
                                <ul className="list-disc ml-5">
                                    {Object.entries(customDetails).map(([key, value], index) => (
                                        <li key={index}>
                                            <strong>{key}:</strong> {value}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                )}

                {/* Products Section */}
                <div>
                    <h3 className="text-xl font-bold text-black mb-2">Products</h3>
                    <div className="space-y-4">
                        {order.products.map((product, index) => (
                            <div key={index} className="bg-gray-100 p-4 rounded-lg shadow-md">
                                <p><strong>Product Name:</strong> {product.name}</p>
                                <p><strong>Price:</strong> {product.price === 0 ? 'To be determined' : `${product.price.toFixed(2)} RON`}</p>
                                <p><strong>Quantity:</strong> {product.quantity}</p>
                                {product.productId === 'custom' && product.customDetails && (
                                    <div className="mt-2">
                                        <p><strong>Custom Details:</strong></p>
                                        <ul className="list-disc ml-5">
                                            {Object.entries(product.customDetails).map(([key, value]) => (
                                                <li key={key}><strong>{key}:</strong> {value}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* QR Code Section */}
                {qrCode && (
                    <div className="text-center mt-6">
                        <h3 className="text-xl font-bold text-black mb-4">Pickup QR Code</h3>
                        <img src={qrCode} alt="QR Code" className="mx-auto" />
                    </div>
                )}

                {/* Back Button */}
                <div className="text-center mt-8">
                    <button
                        className="bg-gray-800 text-white py-2 px-6 rounded hover:bg-gray-700 transition duration-300"
                        onClick={() => navigate(-1)}
                    >
                        Back to Orders
                    </button>
                </div>
            </div>
        </div>
    );
}

function getStatusClass(status) {
    switch (status) {
        case 'pending':
            return 'bg-yellow-200 text-yellow-800';
        case 'accepted':
            return 'bg-green-200 text-green-800';
        case 'declined':
            return 'bg-red-200 text-red-800';
        case 'delivered':
            return 'bg-blue-200 text-blue-800';
        case 'completed':
            return 'bg-green-500 text-white';
        case 'waiting for pickup':
            return 'bg-purple-200 text-purple-800';
        default:
            return 'bg-gray-200 text-gray-800';
    }
}
