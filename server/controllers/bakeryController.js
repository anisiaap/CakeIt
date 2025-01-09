const Bakery = require('../models/Bakery');

// Get all bakeries
const getAllBakeries = async (req, res) => {
    try {
        const bakeries = await Bakery.find().populate('products', 'name price');

        // Add full image URL for each bakery
        const updatedBakeries = bakeries.map((bakery) => {
            return {
                ...bakery._doc, // Spread the bakery data
                imageUrl: bakery.imageUrl ? `http://192.168.1.96:5001/uploads/${bakery.imageUrl}` : null, // Construct full URL
            };
        });

        res.status(200).json(updatedBakeries);
    } catch (err) {
        console.error('Error fetching bakeries:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
};
// Get a bakery by ID
const getBakeryById = async (req, res) => {
    try {
        console.log('Received ID:', req.params.id); // Log the received ID
        const bakery = await Bakery.findById(req.params.id).populate({
            path: 'products',
            select: 'name price description ingredients image stock',
        });
        console.log(bakery);

        if (!bakery) {
            return res.status(404).json({ message: 'Bakery not found' });
        }

        // Construct full image URLs for products
        const updatedBakery = {
            ...bakery._doc,
            imageUrl: bakery.imageUrl ? `http://192.168.1.96:5001/uploads/${bakery.imageUrl}` : null,
            products: bakery.products.map((product) => ({
                ...product._doc,
                image: product.image ? `http://192.168.1.96:5001/uploads/${product.image}` : null,
            })),
        };
        console.log("here");
        console.log(updatedBakery); // Log the received ID
        res.status(200).json(updatedBakery);
    } catch (err) {
        console.error('Error fetching bakery details:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
};
// Update bakery details
const updateBakery = async (req, res) => {
    const { name, location, description, rating, imageUrl } = req.body;

    try {
        const updatedBakery = await Bakery.findByIdAndUpdate(
            req.params.id,
            { name, location, description, rating, imageUrl },
            { new: true }
        );

        if (!updatedBakery) return res.status(404).json({ message: 'Bakery not found' });

        res.status(200).json(updatedBakery);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete a bakery
const deleteBakery = async (req, res) => {
    try {
        const bakery = await Bakery.findByIdAndDelete(req.params.id);
        if (!bakery) return res.status(404).json({ message: 'Bakery not found' });
        res.status(200).json({ message: 'Bakery deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};
const approveBakery = async (req, res) => {
    try {
        const { id } = req.params;
        const { approvalStatus, rejectionReason } = req.body;

        // Find the bakery by ID
        const bakery = await Bakery.findById(id);
        if (!bakery) {
            return res.status(404).json({ message: 'Bakery not found' });
        }

        // Update approval status
        bakery.approvalStatus = approvalStatus; // "approved" or "rejected"
        if (approvalStatus === 'rejected' && rejectionReason) {
            bakery.rejectionReason = rejectionReason; // Save rejection reason
        }

        await bakery.save();

        // Notify bakery (you can use an email service here)
        if (approvalStatus === 'approved') {
            console.log(`Bakery ${bakery.email} approved.`);
            // Send email or notification logic here
        } else if (approvalStatus === 'rejected') {
            console.log(`Bakery ${bakery.email} rejected.`);
            // Send email or notification logic here
        }

        res.status(200).json({ message: `Bakery ${approvalStatus} successfully.` });
    } catch (err) {
        console.error('Error approving bakery:', err);
        res.status(500).json({ message: 'Server error' });
    }
};
module.exports = { getAllBakeries, getBakeryById, updateBakery, deleteBakery,     approveBakery};
