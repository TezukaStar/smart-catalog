// Require an express
const express = require("express");

// Pull a router function from express
const router = express.Router();

// Require a middleware auth
const { auth } = require("../middleware/auth");

// Require a promotion controller
const promotionController = require("../controllers/promotionController");

// Routers
router.post("/", auth, promotionController.addedPromotion);
router.get("/", promotionController.getPromotions);
router.get("/:id", promotionController.getPromontion);
router.delete("/:id", promotionController.deletePromotion);
router.put("/:id", promotionController.updatePromotion);
router.post("/:id", promotionController.addProductToPromotion);

// Export a route
module.exports = router;
