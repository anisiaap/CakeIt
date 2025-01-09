const EasyboxReservation = require('../models/EasyboxReservation');
const Order = require('../models/Order');
// Update Easybox reservation and order status
const updateEasyboxbox = async (req, res) => {
    const { orderId, state, orderStatus } = req.body;

    try {
        // Update Easybox reservation status
        const reservation = await EasyboxReservation.findOneAndUpdate(
            { orderId },
            { state },
            { new: true }
        );

        if (!reservation) {
            return res.status(404).json({ message: 'Reservation not found' });
        }

        // Update Order status
        const order = await Order.findByIdAndUpdate(
            orderId,
            { status: orderStatus },
            { new: true }
        );

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.status(200).json({
            message: 'Reservation and order status updated successfully',
            reservation,
            order,
        });
    } catch (error) {
        console.error('Error updating Easybox:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
const updateEasybox = async (req, res) => {
    const { orderId, state, orderStatus } = req.body;

    try {
        // Update Easybox reservation status
        const reservation = await EasyboxReservation.findOneAndUpdate(
            { orderId },
            { state },
            { new: true }
        );

        if (!reservation) {
            return res.status(404).json({ message: 'Reservation not found' });
        }

        // Update Order status
        const order = await Order.findByIdAndUpdate(
            orderId,
            { status: orderStatus },
            { new: true }
        );

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.status(200).json({
            message: 'Reservation and order status updated successfully',
            reservation,
            order,
        });
    } catch (error) {
        console.error('Error updating Easybox:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
// Reserve Easybox slot
const reserveEasybox = async (req, res) => {
    const { orderId, reservationDate, state } = req.body;

    try {
        const reservation = new EasyboxReservation({
            orderId,
            reservationDate: new Date(reservationDate).toISOString(), // Normalize the date
            state,
        });

        await reservation.save();
        res.status(201).json(reservation);
    } catch (err) {
        console.error('Error reserving Easybox:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Check Easybox availability
const checkEasybox = async (req, res) => {
    const { reservationDate } = req.body;

    try {
        const startOfDay = new Date(reservationDate);
        startOfDay.setUTCHours(0, 0, 0, 0);

        const endOfDay = new Date(reservationDate);
        endOfDay.setUTCHours(23, 59, 59, 999);

        const existingReservations = await EasyboxReservation.find({
            reservationDate: { $gte: startOfDay, $lte: endOfDay },
            state: { $ne: 'completed' },
        });

        res.json({ isReserved: existingReservations.length > 0 });
    } catch (error) {
        console.error('Error checking Easybox availability:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
const checkEasyboxStatus = async (req, res) => {
    try {
        // Check if there is any reservation with state other than 'completed'
        const reservations = await EasyboxReservation.find({
            state: { $ne: 'completed' },
        });

        if (!reservations.length) {
            return res.json({ hasOrders: false, message: 'Easybox is empty' });
        }

        const isFull = reservations.every(res => res.state === 'waiting for pickup');
        return res.json({ hasOrders: true, isFull, message: isFull ? 'Easybox is full' : 'Easybox has space' });
    } catch (error) {
        console.error('Error checking Easybox status:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {updateEasybox, reserveEasybox, checkEasybox, checkEasyboxStatus, updateEasyboxbox };
