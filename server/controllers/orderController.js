const Order = require('../models/Order');

// Create a new order
const createOrder = async (req, res) => {
    try {
        const { bakeryId, products, pickupOption, deliveryAddress, deliveryDate, transportCost, notes } = req.body;

        // Validate custom orders
        const hasCustomOrder = products.some((product) => product.productId === 'custom');
        if (hasCustomOrder && products.length > 1) {
            return res.status(400).json({
                message: 'A custom order must not contain other products.',
            });
        }

        const totalPrice = products.reduce((sum, product) => sum + product.price * product.quantity, 0) + transportCost;

        const newOrder = new Order({
            clientId: req.user.id,
            bakeryId,
            products: products.map((product) => ({
                productId: product.productId,
                name: product.name,
                price: product.price,
                quantity: product.quantity,
            })),
            status: 'pending',
            totalPrice,
            transportCost,
            pickupOption,
            deliveryAddress: pickupOption === 'delivery' ? deliveryAddress : null,
            deliveryDate,
            notes: notes, // Ensure custom notes are stored
        });

        await newOrder.save();
        res.status(201).json(newOrder);
    } catch (err) {
        console.error('Error creating order:', err.message);
        res.status(500).json({ message: 'Server error. Unable to create order.', error: err.message });
    }
};

// Get orders for a specific bakery
const Client = require('../models/Client'); // Import the Client model
const getOrdersByBakery = async (req, res) => {
    try {
        // Ensure req.user is populated
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'Unauthorized: Bakery ID is missing' });
        }

        const bakeryId = req.user.id;

        // Fetch orders for the logged-in bakery
        const orders = await Order.find({ bakeryId });

        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: 'No orders found for this bakery' });
        }

        // Process and enrich orders
        const enrichedOrders = await Promise.all(
            orders.map(async (order) => {
                // Separate valid product IDs and custom products
                const validProducts = order.products.filter(
                    (product) => product.productId !== 'custom'
                );
                const customProducts = order.products.filter(
                    (product) => product.productId === 'custom'
                );

                // Populate valid product IDs
                const populatedProducts = await Promise.all(
                    validProducts.map(async (product) => {
                        const populatedProduct = await Product.findById(product.productId).select(
                            'name price'
                        );
                        return {
                            ...product.toObject(),
                            name: populatedProduct?.name || 'Unknown Product',
                            price: populatedProduct?.price || product.price, // Fallback price
                        };
                    })
                );

                // Combine populated products with custom products
                const allProducts = [
                    ...populatedProducts,
                    ...customProducts.map((product) => ({
                        ...product.toObject(),
                        name: `Custom Order: ${product.customDetails?.productType || 'N/A'}`,
                    })),
                ];

                // Fetch client details
                const client = await Client.findById(order.clientId, 'username email');
                return {
                    ...order.toObject(),
                    products: allProducts, // Use enriched products
                    client: client ? client : { name: 'Unknown', email: 'Unknown' }, // Fallback for client
                };
            })
        );

        res.status(200).json(enrichedOrders);
    } catch (err) {
        console.error('Error fetching orders for bakery:', err.message);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};
// Get all orders for an admin
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate('clientId bakeryId products.productId');
        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Client cancels their order
const cancelOrderByClient = async (req, res) => {
    try {
        const orderId = req.params.id;

        // Ensure the order belongs to the authenticated client
        const order = await Order.findOne({ _id: orderId, clientId: req.user.id });

        if (!order) {
            return res.status(404).json({ message: 'Order not found or not authorized' });
        }

        // Update the status to 'declined'
        order.status = 'declined';
        await order.save();

        res.status(200).json(order);
    } catch (err) {
        console.error('Error canceling order:', err.message);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};
// Get a specific order by ID
const Product = require('../models/Product');
const getOrderById = async (req, res) => {
    try {
        const { id } = req.params;

        // Fetch the order and populate the client details
        const order = await Order.findById(id).populate('clientId', 'email username');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Enrich products to handle "custom" product IDs
        const enrichedProducts = await Promise.all(
            order.products.map(async (product) => {
                if (product.productId === 'custom') {
                    // Handle custom orders
                    return {
                        ...product.toObject(),
                        name: `Custom Order: ${product.customDetails?.productType || 'N/A'}`,
                    };
                } else {
                    // Handle regular products
                    const populatedProduct = await Product.findById(product.productId).select('name price');
                    return {
                        ...product.toObject(),
                        name: populatedProduct?.name || 'Unknown Product',
                        price: populatedProduct?.price || product.price, // Use fallback price
                    };
                }
            })
        );

        res.status(200).json({
            ...order.toObject(),
            products: enrichedProducts,
            client: order.clientId, // Include populated client details
        });
    } catch (err) {
        console.error('Error fetching order:', err.message);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};
// Get orders for a specific client
const getOrdersByClient = async (req, res) => {
    try {
        // Fetch orders for the client
        const orders = await Order.find({ clientId: req.user.id });

        // Process the orders to handle custom orders
        const enrichedOrders = orders.map((order) => ({
            ...order.toObject(),
            products: order.products.map((product) =>
                product.productId === 'custom'
                    ? {
                        ...product,
                        customDetails: product.customDetails || null, // Include custom details if available
                    }
                    : product // Keep other products unchanged
            ),
        }));

        res.status(200).json(enrichedOrders);
    } catch (err) {
        console.error('Error fetching orders:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
};

const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['pending', 'accepted', 'waiting for delivery', 'waiting for pickup', 'completed'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const updatedOrder = await Order.findByIdAndUpdate(
            id,
            { status },
            { new: true } // Return the updated order
        ).populate('clientId', 'email username'); // Re-populate the client fields

        if (!updatedOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.status(200).json(updatedOrder);
    } catch (err) {
        console.error('Error updating order status:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { createOrder, getAllOrders, getOrdersByClient, updateOrderStatus, getOrdersByBakery ,getOrderById ,cancelOrderByClient };
