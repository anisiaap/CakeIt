import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function ViewOrderDetailsBakery() {
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [qrCode, setQRCode] = useState(null);
    const [confirmationModal, setConfirmationModal] = useState({
        isVisible: false,
        message: '',
        onConfirm: null,
    });
    const [lockerConfirmationModal, setLockerConfirmationModal] = useState(false);
    const backendHost = process.env.REACT_APP_BACKEND_HOST;

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const response = await fetch(`${backendHost}/api/orders/${orderId}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch order details');
                }
                const data = await response.json();
                setOrder(data);
            } catch (err) {
                console.error('Error fetching order details:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        const fetchQRCode = async () => {
            try {
                const response = await fetch(`${backendHost}/api/qr/qr/${orderId}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });

                if (response.ok) {
                    const { qrCode } = await response.json();
                    setQRCode(qrCode); // QR code exists, show it
                }
            } catch (err) {
                console.error('Error fetching QR code:', err);
            }
        };

        fetchOrderDetails();
        fetchQRCode();
    }, [orderId]);

    const handleChangeStatus = async (newStatus) => {
        try {
            const response = await fetch(`${backendHost}/api/orders/${orderId}/status`, {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: newStatus }),
            });

            if (!response.ok) {
                throw new Error('Failed to update order status');
            }

            const updatedOrder = await response.json();
            setOrder(updatedOrder);
        } catch (err) {
            console.error('Error updating order status:', err);
        }
    };

    const handleGenerateQRCode = async () => {
        try {
            const response = await fetch(`${backendHost}/api/qr/generate-qr`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({
                    orderId: order._id,
                    orderStatus: order.status,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to generate QR code');
            }

            const { qrCode } = await response.json();
            setQRCode(qrCode);
        } catch (error) {
            console.error('Error generating QR code:', error);
        }
    };

    const handleOpenLocker = () => {
        setTimeout(() => {
            setLockerConfirmationModal(true);
        }, 4000); // 4 seconds timeout
    };

    const showConfirmation = (message, action) => {
        setConfirmationModal({ isVisible: true, message, onConfirm: action });
    };

    const isStatus = (status) => order?.status === status;

    const getStatusClass = (status) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-200 text-yellow-800';
            case 'accepted':
                return 'bg-blue-200 text-blue-800';
            case 'waiting for delivery':
                return 'bg-purple-200 text-purple-800';
            case 'waiting for pickup':
                return 'bg-green-200 text-green-800';
            case 'completed':
                return 'bg-green-500 text-white';
            case 'declined':
                return 'bg-red-200 text-red-800';
            default:
                return 'bg-gray-200 text-gray-800';
        }
    };

    if (loading) return <div className="text-center py-8">Loading order details...</div>;
    if (error) return <div className="text-center py-8 text-red-500">Error: {error}</div>;

    return (
        <div className="min-h-screen bg-gray-50 text-black p-8">
            <h1 className="text-4xl font-bold text-center mb-6">Order Details</h1>
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl mx-auto space-y-6">
                {/* Delivery Date Highlight */}
                <div className="bg-gray-800 p-4 rounded-md text-center text-white">
                    <h2 className="text-2xl font-bold">
                        Delivery Date: {new Date(order.deliveryDate).toLocaleString()}
                    </h2>
                </div>

                {/* Order and Client Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <h3 className="text-lg font-bold">Order Information</h3>
                        <p><strong>Order ID:</strong> {order._id}</p>
                        <p>
                            <strong>Status:</strong>
                            <span
                                className={`ml-2 px-2 py-1 rounded ${getStatusClass(order.status)}`}
                            >
                                {order.status}
                            </span>
                        </p>
                        <p><strong>Total Price:</strong> RON {order.totalPrice.toFixed(2)}</p>
                        <p><strong>Pickup Option:</strong> {order.pickupOption}</p>
                        {order.deliveryAddress && (
                            <p><strong>Delivery Address:</strong> {order.deliveryAddress}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-lg font-bold">Client Information</h3>
                        <p><strong>Email:</strong> {order.clientId?.email || 'Unknown'}</p>
                        <p><strong>Username:</strong> {order.clientId?.username || 'Unknown'}</p>
                        <p><strong>Order Date:</strong> {new Date(order.orderDate).toLocaleString()}</p>
                    </div>
                </div>

                {/* QR Code Section */}
                {qrCode && (
                    <div className="text-center">
                        <h3 className="text-lg font-bold mb-4">QR Code</h3>
                        <img src={qrCode} alt="Order QR Code" className="inline-block border border-gray-300 rounded-lg shadow-lg" />
                    </div>
                )}

                {/* Actions Section */}
                <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                    <button
                        className={`py-2 px-4 rounded ${
                            isStatus('pending') ? 'bg-black text-white hover:bg-gray-800' : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        }`}
                        onClick={() =>
                            isStatus('pending') &&
                            showConfirmation('Do you want to accept the order?', () => handleChangeStatus('accepted'))
                        }
                    >
                        Accept Order
                    </button>

                    <button
                        className={`py-2 px-4 rounded ${
                            isStatus('pending') ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        }`}
                        onClick={() =>
                            isStatus('pending') &&
                            showConfirmation('Do you want to decline the order?', () => handleChangeStatus('declined'))
                        }
                    >
                        Decline Order
                    </button>

                    <button
                        className={`py-2 px-4 rounded ${
                            isStatus('accepted') ? 'bg-black text-white hover:bg-gray-800' : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        }`}
                        onClick={() =>
                            isStatus('accepted') &&
                            showConfirmation('Mark this order as waiting for delivery?', () => handleChangeStatus('waiting for delivery'))
                        }
                    >
                        Mark as Waiting for Delivery
                    </button>

                    {((isStatus('waiting for delivery') && order.pickupOption === 'easybox')) && (
                        <button
                            className={`py-2 px-4 rounded ${
                                qrCode ? 'bg-yellow-500 text-white hover:bg-yellow-600' : 'bg-black text-white hover:bg-gray-800'
                            }`}
                            onClick={() => {
                                qrCode
                                    ? handleOpenLocker()
                                    : showConfirmation('Show a QR Code for locker?', handleGenerateQRCode);
                            }}
                        >
                            {'Show QR Code'}
                        </button>
                    )}

                    <button
                        className={`py-2 px-4 rounded ${
                            isStatus('waiting for pickup') ? 'bg-black text-white hover:bg-gray-800' : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        }`}
                        onClick={() =>
                            isStatus('waiting for pickup') &&
                            showConfirmation('Mark this order as completed?', () => handleChangeStatus('completed'))
                        }
                    >
                        Mark as Completed
                    </button>
                </div>
            </div>

            {/* Confirmation Modal */}
            {confirmationModal.isVisible && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm">
                        <h2 className="text-lg font-bold mb-4">Confirm Action</h2>
                        <p>{confirmationModal.message}</p>
                        <div className="flex justify-between mt-4">
                            <button
                                className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
                                onClick={() => setConfirmationModal({ isVisible: false })}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
                                onClick={() => {
                                    confirmationModal.onConfirm();
                                    setConfirmationModal({ isVisible: false });
                                }}
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Locker Confirmation Modal */}
            {lockerConfirmationModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm">
                        <h2 className="text-lg font-bold mb-4">Locker Confirmation</h2>
                        <p>Did you put the order in the easybox?</p>
                        <div className="flex justify-between mt-4">
                            <button
                                className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
                                onClick={() => setLockerConfirmationModal(false)}
                            >
                                No
                            </button>
                            <button
                                className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
                                onClick={async () => {
                                    await handleChangeStatus('waiting for pickup');
                                    setLockerConfirmationModal(false);
                                }}
                            >
                                Yes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ViewOrderDetailsBakery;
