const express = require('express');
const router = express.Router();
const { createOrder, getOrderById, updateOrder, deleteOrder } = require('../models/order');

// Create a new order
router.post('/', async (req, res) => {
    try {
        const orderId = await createOrder(req.body);
        res.status(201).json({ message: "Order created successfully", orderId });
    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Retrieve an order by ID
router.get('/:orderId', async (req, res) => {
    try {
        const order = await getOrderById(req.params.orderId);
        if (order) {
            res.status(200).json(order);
        } else {
            res.status(404).json({ error: "Order not found" });
        }
    } catch (error) {
        console.error("Error retrieving order:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Update an existing order
router.put('/:orderId', async (req, res) => {
    try {
        const result = await updateOrder(req.params.orderId, req.body);
        if (result.modifiedCount === 0) {
            res.status(404).json({ message: "No order found with this ID" });
        } else {
            res.status(200).json({ message: "Order updated successfully" });
        }
    } catch (error) {
        console.error("Error updating order:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Delete an order
router.delete('/:orderId', async (req, res) => {
    try {
        const result = await deleteOrder(req.params.orderId);
        if (result === 0) {
            res.status(404).json({ message: "No order found with this ID" });
        } else {
            res.status(200).json({ message: "Order deleted successfully" });
        }
    } catch (error) {
        console.error("Error deleting order:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;
