const express = require("express");
const authController = require("../controllers/authController");
const endpoints = require("../utils/endpoints");

const router = express.Router();

router.post(`${endpoints.register}`, authController.register);
router.post(`${endpoints.login}`, authController.login);
router.get(`${endpoints.refresh}`, authController.refresh);
router.get(`${endpoints.logout}`, authController.logout);

module.exports = router;
