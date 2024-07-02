const express = require("express");
const router = express.Router();
const itemController = require("../controllers/itemController");

router.get("/get-items-by-id/:id", itemController.getItemsById);
router.post("/add-item", itemController.addItem);
router.put("/update-item/:id", itemController.updateItem);
router.delete("/remove-item/:id", itemController.removeItem);
router.get("/get-all-items", itemController.getAllItems);

module.exports = router;
