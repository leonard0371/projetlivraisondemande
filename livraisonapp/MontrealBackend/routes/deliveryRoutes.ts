import { Router } from 'express';
import { DeliveryModel } from '../models/IDelivery';
import { authenticateToken } from '../Middleware/TokenMiddleware';

export const deliveryRouter = Router();

// Vendor: Create a new delivery request
// POST /api/deliveries
// Body: { pickupAddress, deliveryAddress, clientName, clientPhoneNumber, productDetails }
deliveryRouter.post('/api/deliveries', authenticateToken, async (req, res) => {
  try {
    const vendorId = (req as any).user.id;
    const { pickupAddress, deliveryAddress, clientName, clientPhoneNumber, productDetails } = req.body;
    const newDelivery = new DeliveryModel({
      vendorId,
      pickupAddress,
      deliveryAddress,
      clientName,
      clientPhoneNumber,
      productDetails,
      status: 'pending',
    });
    await newDelivery.save();
    res.status(201).json(newDelivery);
  } catch (error) {
    res.status(500).json({ message: 'Error creating delivery request', error });
  }
});

// Vendor: Get their delivery history
// GET /api/deliveries/vendor-history
deliveryRouter.get('/api/deliveries/vendor-history', authenticateToken, async (req, res) => {
  try {
    const vendorId = (req as any).user.id;
    const deliveries = await DeliveryModel.find({ vendorId }).sort({ requestTimestamp: -1 });
    res.status(200).json(deliveries);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching delivery history', error });
  }
});

// Driver: Get all available (pending) deliveries
// GET /api/deliveries/available
deliveryRouter.get('/api/deliveries/available', authenticateToken, async (req, res) => {
  try {
    const availableDeliveries = await DeliveryModel.find({ status: 'pending' });
    res.status(200).json(availableDeliveries);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching available deliveries', error });
  }
});

// Driver: Accept a delivery (atomic)
// PATCH /api/deliveries/:id/accept
deliveryRouter.patch('/api/deliveries/:id/accept', authenticateToken, async (req, res) => {
  try {
    const driverId = (req as any).user.id;
    const { id } = req.params;
    // Atomic update: only accept if still pending
    const delivery = await DeliveryModel.findOneAndUpdate(
      { _id: id, status: 'pending' },
      { $set: { driverId, status: 'accepted', deliveryTimestamp: new Date() } },
      { new: true }
    );
    if (!delivery) {
      return res.status(400).json({ message: 'Delivery already accepted or not found.' });
    }
    res.status(200).json(delivery);
  } catch (error) {
    res.status(500).json({ message: 'Error accepting delivery', error });
  }
}); 