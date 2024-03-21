const express = require('express');
const truckPricesController = require('../controllers/truckPricesController');
const windproofPricesController = require('../controllers/windproofPricesController');
const endpoints = require('../utils/endpoints');

const router = express.Router();

router.get(`${endpoints.truckCoversPricesUrl}`, truckPricesController.truckCoversPrice);
router.put(`${endpoints.truckCoversEditPricesUrl}`, truckPricesController.truckCoversEditPrice);
router.get(`${endpoints.truckGondolaPricesUrl}`, truckPricesController.truckGondolaPrices);
// router.put(`${endpoints.truckShutterPriceUrl}`, truckController.truckShutterPriceOffer);
router.get(`${endpoints.truckShutterPricesUrl}`, truckPricesController.truckShutterPrices);
// router.put(`${endpoints.windProofEditPricesUrl}`, truckController.truckOfferFile);
router.get(`${endpoints.windproofPricesUrl}`, windproofPricesController.windproofCurtainPrices);
router.put(`${endpoints.windProofEditPricesUrl}`, windproofPricesController.windproofCurtainsEditPrice);

module.exports = router;