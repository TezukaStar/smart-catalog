// Require an express
const express = require('express');

// Pull a router function from express
const router = express.Router();
    
// Require a middleware auth
const { auth } = require('../middleware/auth');

// Require a cart controller
const cartController = require('../controllers/cartController');

// Routers
router.post('/', auth, cartController.addItem);
router.get('/', auth, cartController.getCartById);
router.delete('/', cartController.removeFromCart);
router.put('/', cartController.updateCart);

// Export a route
module.exports = router;