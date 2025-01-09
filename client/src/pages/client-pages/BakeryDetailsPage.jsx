import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSpring, animated } from '@react-spring/web';
import { useCart } from '../../context/CartContext';

function BakeryDetailsPage() {
  const { bakeryId } = useParams();
  const navigate = useNavigate();
  const [bakery, setBakery] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [notification, setNotification] = useState(null); // Notification state
  const backendHost = process.env.REACT_APP_BACKEND_HOST;
  // Spring animations
  const fadeIn = useSpring({
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
    config: { tension: 300, friction: 10 },
  });

  const buttonProps = useSpring({
    scale: 1,
    config: { tension: 300, friction: 10 },
  });

  // Fetch bakery details
  useEffect(() => {
    const fetchBakery = async () => {
      try {
        const response = await fetch(`${backendHost}/api/bakeries/${bakeryId}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch bakery details: ${response.statusText}`);
        }
        const data = await response.json();
        setBakery(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBakery();
  }, [bakeryId]);

  // Add product to cart
  const handleAddToCart = (product) => {
    const cartProduct = {
      id: product._id,
      name: product.name,
      price: product.price,
      quantity: 1,
    };

    addToCart(cartProduct, bakeryId, bakery.name);
    showNotification(`${product.name} added to cart.`);
  };

  // Show notification
  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  // Show product details in modal
  const handleShowDetails = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setSelectedProduct(null);
    setShowModal(false);
  };

  // Truncate text
  const truncateText = (text, maxLength) => {
    if (!text) return '';
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
  };

  // Render stars
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating || 0);
    const halfStar = rating % 1 !== 0;
    const totalStars = 5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={`full-${i}`} className="text-yellow-500">&#9733;</span>);
    }
    if (halfStar) {
      stars.push(<span key="half" className="text-yellow-500">&#9734;</span>);
    }
    for (let i = stars.length; i < totalStars; i++) {
      stars.push(<span key={`empty-${i}`} className="text-gray-300">&#9734;</span>);
    }
    return stars;
  };

  if (isLoading) {
    return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="loader"></div>
        </div>
    );
  }

  if (error) {
    return <p className="text-center text-2xl text-red-600 mt-8">{error}</p>;
  }

  if (!bakery) {
    return <p className="text-center text-2xl text-gray-700 mt-8">Bakery not found.</p>;
  }

  return (
      <div className="bg-gray-100 min-h-screen">
        {/* Notification */}
        {notification && (
            <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-black text-white px-6 py-3 rounded-md shadow-lg z-50">
              {notification}
            </div>
        )}

        {/* Full-width Background Image */}
        <div
            className="relative w-full h-64 bg-cover bg-center"
            style={{
              backgroundImage: `url(${bakery.imageUrl || '/fallback-image.jpg'})`,
            }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          <div className="absolute bottom-4 left-4 text-white">
            <h1 className="text-4xl font-bold">{bakery.name}</h1>
            <p className="text-lg">{bakery.description}</p>
          </div>
        </div>

        {/* Details Section */}
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center mb-6">
            <div className="text-2xl mr-2">{renderStars(bakery.rating)}</div>
            <span className="text-gray-600 text-lg">({bakery.rating || 0} out of 5)</span>
          </div>

          {/* Products Section */}
          <h2 className="text-2xl font-bold mb-4">Available Products</h2>
          <div className="space-y-6">
            {bakery.products && bakery.products.length > 0 ? (
                bakery.products.map((product) => (
                    <div
                        key={product._id}
                        className="flex flex-col md:flex-row items-center bg-white rounded-lg shadow-md overflow-hidden mx-auto max-w-4xl hover:shadow-lg transition-shadow duration-300"
                    >
                      {/* Product Image */}
                      <img
                          src={product.image || '/fallback-image.jpg'}
                          alt={product.name}
                          className="w-full md:w-48 h-48 object-cover rounded-t-lg md:rounded-t-none md:rounded-l-lg"
                      />

                      {/* Product Details */}
                      <div className="p-4 flex flex-col justify-between flex-grow">
                        <h3 className="text-xl font-bold text-gray-900">{product.name}</h3>
                        <p className="text-gray-700 mt-2">
                          {truncateText(product.description, 100)}
                        </p>
                        <div className="mt-4 flex justify-between items-center">
                          <span className="text-lg font-bold text-gray-900">RON {product.price}</span>
                          <div className="flex gap-2">
                            <button
                                onClick={() => handleAddToCart(product)}
                                className="bg-gray-900 text-white py-1 px-4 rounded-md hover:bg-gray-700 transition-all duration-200"
                            >
                              Add to Cart
                            </button>
                            <button
                                onClick={() => handleShowDetails(product)}
                                className="bg-gray-800 text-white py-1 px-4 rounded-md hover:bg-gray-600 transition-all duration-200"
                            >
                              View Details
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                ))
            ) : (
                <p className="text-gray-600 text-center">No products available.</p>
            )}
          </div>

          <div className="flex justify-center mt-8">
            <animated.button
                style={buttonProps}
                onClick={() =>
                    navigate(`/custom-order/${bakeryId}`, {
                      state: { bakeryId: bakery._id, bakeryName: bakery.name },
                    })
                }
                className="bg-gray-800 text-white py-3 px-6 rounded-full text-lg font-semibold hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200"
            >
              Place a Custom Order
            </animated.button>
          </div>
        </div>

        {/* Modal */}
        {showModal && selectedProduct && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
                <button
                    onClick={handleCloseModal}
                    className="absolute top-2 right-2 text-gray-600 hover:text-black"
                >
                  &#x2715;
                </button>
                <img
                    src={selectedProduct.image || '/fallback-image.jpg'}
                    alt={selectedProduct.name}
                    className="w-full h-48 object-cover mb-4"
                />
                <h2 className="text-2xl font-bold mb-2">{selectedProduct.name}</h2>
                <p className="text-gray-600">{selectedProduct.description}</p>
                <h4 className="mt-4 text-lg font-semibold">Ingredients:</h4>
                <p className="text-gray-600">{selectedProduct.ingredients}</p>
              </div>
            </div>
        )}
      </div>
  );
}

export default BakeryDetailsPage;
