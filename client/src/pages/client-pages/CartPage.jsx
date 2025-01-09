import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

function CartPage() {
  const navigate = useNavigate();
  const { cart, removeFromCart, clearCart } = useCart();

  const [pickupOption, setPickupOption] = useState('in-store');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [notes, setNotes] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [hasCustomOrder, setHasCustomOrder] = useState(false);
  const [multipleBakeriesWarning, setMultipleBakeriesWarning] = useState(false);
  const backendHost = process.env.REACT_APP_BACKEND_HOST;

  useEffect(() => {
    const containsCustomOrder = cart.some((bakery) =>
        bakery.products.some((product) => product.id === 'custom')
    );
    setHasCustomOrder(containsCustomOrder);
  }, [cart]);
  useEffect(() => {
    // Check if cart contains products from multiple bakeries for Easybox option
    const uniqueBakeries = new Set(cart.map((bakery) => bakery.bakeryId));
    if (pickupOption === 'easybox' && uniqueBakeries.size > 1) {
      setMultipleBakeriesWarning(true);
    } else {
      setMultipleBakeriesWarning(false);
    }
  }, [pickupOption, cart]);

  const getTransportCost = () => {
    if (pickupOption === 'delivery') return 15.0;
    if (pickupOption === 'easybox') return 10.0;
    return 0.0;
  };

  const calculateTotals = () => {
    let overallTotal = 0;
    const transportCost = getTransportCost();
    const bakeryTotals = cart.map((bakery) => {
      const productsTotal = bakery.products.reduce(
          (sum, product) => sum + (product.price || 0) * (product.quantity || 1),
          0
      );
      const bakeryTotal = productsTotal + transportCost;
      overallTotal += bakeryTotal;
      return {
        ...bakery,
        productsTotal,
        transportCost,
        bakeryTotal,
      };
    });
    return { bakeryTotals, overallTotal };
  };

  const { bakeryTotals, overallTotal } = calculateTotals();

  const validateDeliveryDate = (dateString) => {
    const currentDate = new Date();
    const selectedDate = new Date(dateString);

    const day = selectedDate.getDay(); // 0 = Sunday, 6 = Saturday
    const hour = selectedDate.getHours();

    return (
        selectedDate > currentDate &&
        day >= 1 &&
        day <= 5 &&
        hour >= 10 &&
        hour <= 17
    );
  };

  const handleCheckout = async () => {
    // Check for Easybox restrictions
    if (multipleBakeriesWarning) {
      setModalMessage(
          'The Easybox option is only available for orders from a single bakery.'
      );
      setShowModal(true);
      return;
    }
    const totalProducts = cart.reduce((total, bakery) => {
      return total + bakery.products.reduce((sum, product) => sum + product.quantity, 0);
    }, 0);
    // Check for custom order restrictions
    if (hasCustomOrder && totalProducts > 1) {
      setModalMessage(
          'Your cart contains a custom order. You can only checkout with the custom order for a single bakery.'
      );
      setShowModal(true);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setModalMessage('Please log in to proceed with the checkout.');
        setShowModal(true);
        return;
      }

      if (!cart.length) {
        setModalMessage('Your cart is empty.');
        setShowModal(true);
        return;
      }

      if (!validateDeliveryDate(deliveryDate)) {
        setModalMessage(
            'Please select a valid delivery date. Delivery must be in the future, Monday to Friday, between 10 AM and 5 PM.'
        );
        setShowModal(true);
        return;
      }

      if (pickupOption === 'delivery' && !deliveryAddress.trim()) {
        setModalMessage('Please provide a delivery address.');
        setShowModal(true);
        return;
      }

      const normalizedDate = new Date(deliveryDate).toISOString();

      // Check Easybox availability
      if (pickupOption === 'easybox') {
        const response = await fetch(`${backendHost}/api/easybox/reservations/check`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            reservationDate: normalizedDate,
          }),
        });

        const reservationCheck = await response.json();

        if (!response.ok || reservationCheck.isReserved) {
          setModalMessage(
              'The Easybox is not available on the selected date. Please choose another date or pickup method.'
          );
          setShowModal(true);
          return;
        }
      }

      // Place orders
      const orders = cart.map((bakery) => ({
        bakeryId: bakery.bakeryId,
        products: bakery.products.map((product) => ({
          productId: product.id === 'custom' ? 'custom' : product.id,
          name: product.name,
          price: product.price,
          quantity: product.quantity || 1,
        })),
        transportCost: getTransportCost(),
        totalPrice:
            bakery.products.reduce(
                (sum, product) => sum + (product.price || 0) * (product.quantity || 1),
                0
            ) + getTransportCost(),
        pickupOption,
        deliveryAddress: pickupOption === 'delivery' ? deliveryAddress : null,
        deliveryDate: normalizedDate,
        notes: bakery.products
            .filter((product) => product.id === 'custom')
            .map((product) => product.notes || '')
            .join(', ') || notes,
      }));

      const createdOrders = await Promise.all(
          orders.map((order) =>
              fetch(`${backendHost}/api/orders`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(order),
              }).then((res) => {
                if (!res.ok) throw new Error('Failed to create order');
                return res.json(); // Capture the created order from the response
              })
          )
      );

      if (!createdOrders || createdOrders.length === 0) {
        setModalMessage('Failed to create orders. Please try again.');
        setShowModal(true);
        return;
      }

      const createdOrderId = createdOrders[0]._id;

      // Reserve Easybox
      if (pickupOption === 'easybox') {
        const reservationResponse = await fetch(`${backendHost}/api/easybox/reserve`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            orderId: createdOrderId,
            reservationDate: new Date(deliveryDate).toISOString(),
            state: 'waiting for delivery',
          }),
        });

        if (!reservationResponse.ok) {
          setModalMessage('Failed to reserve Easybox. Please try again.');
          setShowModal(true);
          return;
        }
      }

      clearCart();
      setModalMessage('Orders placed successfully!');
      setShowModal(true);
      setTimeout(() => {
        setShowModal(false);
        navigate('/home');
      }, 2000);
    } catch (error) {
      console.error('Error during checkout:', error);
      setModalMessage('An error occurred while placing your orders. Please try again.');
      setShowModal(true);
    }
  };
  return (
      <div className="min-h-screen bg-white text-black p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 flex items-center">Your Cart</h1>

          {hasCustomOrder && (
              <p className="text-red-600 mb-4">
                Note: Your cart contains a custom order. The price will be proposed by the bakery after analysis. If you are
                not satisfied with the proposed price, you can cancel the order. Only the custom order can be in the Cart.
              </p>
          )}
          {multipleBakeriesWarning && (
              <p className="text-red-600 mb-4">
                Warning: The Easybox option is only available for orders from a single bakery.
              </p>
          )}

          {bakeryTotals.length > 0 ? (
              bakeryTotals.map((bakery) => (
                  <div key={bakery.bakeryId} className="mb-8 bg-gray-100 rounded-lg shadow-lg">
                    <div className="p-6">
                      <h2 className="text-2xl font-semibold mb-4">{bakery.bakeryName}</h2>
                      <div className="space-y-4">
                        {bakery.products.map((product) => (
                            <div key={product.id} className="flex justify-between items-center">
                              <div>
                                <h3 className="font-medium">{product.name}</h3>
                                <p className="text-sm text-gray-600">
                                  {product.id === 'custom' ? (
                                      'Price: 0 (To be proposed by bakery)'
                                  ) : (
                                      `Quantity: ${product.quantity || 1}`
                                  )}
                                </p>
                              </div>
                              <div className="flex items-center gap-4">
                                <button
                                    className="text-red-500 hover:text-red-400"
                                    onClick={() => removeFromCart(product.id, bakery.bakeryId)}
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                        ))}
                        <div className="border-t border-gray-300 my-4"></div>
                        <div className="flex justify-between items-center text-sm">
                          <p className="text-gray-600">Transport Cost</p>
                          <p>RON {bakery.transportCost.toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-200 p-4">
                      <div className="flex justify-between items-center">
                        <h4 className="text-lg font-semibold">Subtotal</h4>
                        <p className="text-lg font-bold">RON {bakery.bakeryTotal.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
              ))
          ) : (
              <p className="text-center text-gray-600">Your cart is empty. Add some delicious items!</p>
          )}

          {bakeryTotals.length > 0 && (
              <div className="bg-gray-100 rounded-lg shadow-lg">
                <div className="p-6">
                  <div className="flex flex-col gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Pickup Option</label>
                      <select
                          value={pickupOption}
                          onChange={(e) => setPickupOption(e.target.value)}
                          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                      >
                        <option value="in-store">In-Store</option>
                        <option value="easybox">Easybox</option>
                        <option value="delivery">Delivery</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Delivery Date & Time</label>
                      <input
                          type="datetime-local"
                          value={deliveryDate}
                          onChange={(e) => setDeliveryDate(e.target.value)}
                          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>

                    {pickupOption === 'delivery' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Delivery Address</label>
                          <input
                              type="text"
                              value={deliveryAddress}
                              onChange={(e) => setDeliveryAddress(e.target.value)}
                              placeholder="Enter your address"
                              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                          />
                        </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Notes</label>
                      <textarea
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          placeholder="Optional notes for your order"
                          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-6">
                    <h3 className="text-2xl font-bold">Total</h3>
                    <p className="text-3xl font-bold">RON {overallTotal.toFixed(2)}</p>
                  </div>
                </div>
                <div className="bg-gray-200 p-4 flex justify-between">
                  <button
                      onClick={() => navigate('/home')}
                      className="bg-transparent text-black border border-black px-4 py-2 rounded hover:bg-black hover:text-white transition duration-300"
                  >
                    Continue Shopping
                  </button>
                  <button
                      onClick={handleCheckout}
                      className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition duration-300"
                  >
                    Checkout
                  </button>
                </div>
              </div>
          )}
        </div>

        {/* Modal for messages */}
        {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
              <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm text-center">
                <p className="text-lg font-semibold mb-4">{modalMessage}</p>
                <button
                    className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
                    onClick={() => setShowModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
        )}
      </div>
  );
}

export default CartPage;
