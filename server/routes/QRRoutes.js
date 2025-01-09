const express = require('express');
const QR = require('../models/QR');
const QRCode = require('qrcode'); // For generating QR codes
const router = express.Router();

router.post('/generate-qr', async (req, res) => {
    const { orderId } = req.body;

    try {
        // Check if a QR code already exists for this order
        let qr = await QR.findOne({ orderId });

        if (qr) {
            return res.json({ qrCode: qr.qrCode });
        }

        // Generate a new QR code
        const qrCodeData = `OrderID: ${orderId}`;
        const qrCode = await QRCode.toDataURL(qrCodeData);

        // Save to database
        qr = new QR({ orderId, qrCode });
        await qr.save();

        res.json({ qrCode });
    } catch (error) {
        console.error('Error generating QR code:', error);
        res.status(500).json({ message: 'Failed to generate QR code' });
    }
});
router.get('/qr/:orderId', async (req, res) => {
    const { orderId } = req.params;

    try {
        // Check if a QR code exists for the order
        const qr = await QR.findOne({ orderId });

        if (!qr) {
            return res.status(404).json({ message: 'QR code not found for this order' });
        }
        console.log(qr);
        res.json({ qrCode: qr.qrCode });
    } catch (error) {
        console.error('Error fetching QR code:', error);
        res.status(500).json({ message: 'Failed to fetch QR code' });
    }
});

module.exports = router;
