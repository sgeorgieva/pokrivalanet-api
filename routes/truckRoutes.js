const express = require('express');
const truckController = require('../controllers/truckController');
const endpoints = require('../utils/endpoints');

const router = express.Router();

router.post(`${endpoints.truckPriceUrl}`, truckController.truckPriceOffer);
router.post(`${endpoints.truckFileUrl}`, truckController.truckOfferFile);
router.put(`${endpoints.truckComparedFilesUrl}`, truckController.truckOfferComparedFiles);
router.post(`${endpoints.truckSendEmailUrl}`, truckController.truckOfferEmail);

module.exports = router;
