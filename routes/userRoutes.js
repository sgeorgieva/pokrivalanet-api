const express = require("express");
const userController = require("../controllers/userController");
const endpoints = require("../utils/endpoints");

const router = express.Router();

router.get(`${endpoints.getUserId}`, userController.getUserId);
router.get(`${endpoints.userId}`, userController.getUser);
router.post(`${endpoints.users}`, userController.createUser);
router.put(`${endpoints.user}`, userController.updateUser);
router.delete(`${endpoints.user}`, userController.deleteUser);
router.get(`${endpoints.users}`, userController.getAllUsers);

module.exports = router;