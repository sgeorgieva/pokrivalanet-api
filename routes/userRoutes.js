const express = require('express');
const userController = require('../controllers/userController');
const endpoints = require('../utils/endpoints');
const { verifyToken } = require('../controllers/authController');

const router = express.Router();

router.get(`${endpoints.getUserId}`, verifyToken, userController.getUserId);
router.get(`${endpoints.userId}`, verifyToken, userController.getUser);
router.post(`${endpoints.users}`, userController.createUser);
router.put(`${endpoints.user}`, verifyToken, userController.updateUser);
router.delete(`${endpoints.user}`, verifyToken, userController.deleteUser);
router.get(`${endpoints.users}`, verifyToken, userController.getAllUsers);

module.exports = router;