const Client = require('../models/Client');
const mongoose = require('mongoose');
// Get all clients
const getAllClients = async (req, res) => {
    try {
        const clients = await Client.find().select('-passwordHash');
        res.status(200).json(clients);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Get client by ID
const getClientById = async (req, res) => {
    try {
        const clientId = req.params.id;

        // Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(clientId)) {
            return res.status(400).json({ message: 'Invalid client ID format' });
        }

        const client = await Client.findById(clientId).select('-passwordHash');
        if (!client) {
            return res.status(404).json({ message: 'Client not found' });
        }
        res.status(200).json(client);
    } catch (err) {
        console.error('Error fetching client:', err.message);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};


// Update client details
const updateClient = async (req, res) => {
    const { username, firstName, lastName, phone, address } = req.body;

    try {
        const updatedClient = await Client.findByIdAndUpdate(
            req.params.id,
            { username, firstName, lastName, phone, address },
            { new: true }
        );

        if (!updatedClient) return res.status(404).json({ message: 'Client not found' });

        res.status(200).json(updatedClient);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete client
const deleteClient = async (req, res) => {
    try {
        const client = await Client.findByIdAndDelete(req.params.id);
        if (!client) return res.status(404).json({ message: 'Client not found' });
        res.status(200).json({ message: 'Client deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { getAllClients, getClientById, updateClient, deleteClient };
