const express = require('express');
const contactController = require('../controllers/contactController');
const endpoints = require('../utils/endpoints');

const router = express.Router();

router.post(`${endpoints.verifyTokenUrl}`, contactController.verifyToken);
router.post(`${endpoints.contactUrl}`, contactController.contact);

module.exports = router;
