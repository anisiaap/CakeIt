const Product = require('../models/Product');
const Bakery = require('../models/Bakery');

const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find().populate('bakeryId', 'name');
        res.status(200).json(products);
    } catch (err) {
        console.error('Error fetching products:', err.message);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};
// Add a new product
const addProduct = async (req, res) => {
    try {
        const { name, description, ingredients, price, weight, stock } = req.body;
        const image = req.file?.filename; // Use GridFS filename
        const bakeryId = req.user.id; // Authenticated bakery ID

        if (!name || !price || !weight || !image) {
            return res.status(400).json({ message: 'Name, price, weight, and image are required.' });
        }

        const newProduct = new Product({
            bakeryId,
            name,
            description,
            ingredients,
            price,
            weight,
            stock: stock ?? 0,
            image, // Save the filename for GridFS retrieval
        });

        // Save the product
        await newProduct.save();

        // Add the product to the bakery's product list
        const updatedBakery = await Bakery.findByIdAndUpdate(
            bakeryId,
            { $push: { products: newProduct._id } },
            { new: true }
        );

        if (!updatedBakery) {
            return res.status(404).json({ message: 'Bakery not found.' });
        }

        res.status(201).json({ message: 'Product added successfully', product: newProduct });
    } catch (err) {
        console.error('Error adding product:', err.message);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Update product stock
const updateStock = async (req, res) => {
    try {
        const { id } = req.params;
        const { stock } = req.body;

        if (stock == null || stock < 0) {
            return res.status(400).json({ message: 'Invalid stock value. Stock must be non-negative.' });
        }

        const updatedProduct = await Product.findByIdAndUpdate(id, { stock }, { new: true });
        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found.' });
        }

        res.status(200).json({ message: 'Stock updated successfully.', product: updatedProduct });
    } catch (err) {
        console.error('Error updating stock:', err.message);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Get products by bakery
const getProductsByBakery = async (req, res) => {
    try {
        // Ensure req.user is populated
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'Unauthorized: Bakery ID is missing' });
        }

        const bakeryId = req.user.id;

        // Query products by bakeryId
        const products = await Product.find({ bakeryId });

        if (!products || products.length === 0) {
            return res.status(404).json({ message: 'No products found for this bakery' });
        }

        res.status(200).json(products);
    } catch (err) {
        console.error('Error fetching products for bakery:', err.message);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};
const getStock = async (req, res) => {
    try {
        const { products } = req.body; // [{ productId, quantity }]
        const productIds = products.map(p => p.productId);

        // Fetch the product stock
        const stockData = await Product.find({ _id: { $in: productIds } });

        const insufficientStock = stockData.filter(product => {
            const requiredQuantity = products.find(p => p.productId === product._id.toString()).quantity;
            return product.stock < requiredQuantity; // Check stock availability
        });

        if (insufficientStock.length > 0) {
            return res.status(400).json({
                message: 'Insufficient stock for some products.',
                products: insufficientStock.map(p => ({ name: p.name, stock: p.stock })),
            });
        }

        res.json({ message: 'All products are in stock.' });
    } catch (error) {
        console.error('Error checking stock:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update product
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found.' });
        }

        res.status(200).json(updatedProduct);
    } catch (err) {
        console.error('Error updating product:', err.message);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Delete product
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByIdAndDelete(id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found.' });
        }

        res.status(200).json({ message: 'Product deleted successfully.' });
    } catch (err) {
        console.error('Error deleting product:', err.message);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

module.exports = {
    addProduct,
    getAllProducts,
    getProductsByBakery,
    updateProduct,
    deleteProduct,
    updateStock,
    getStock
};
