const express = require('express');
const truckPricesController = require('../controllers/truckPricesController');
const windproofPricesController = require('../controllers/windproofPricesController');
const endpoints = require('../utils/endpoints');

const router = express.Router();

router.get(`${endpoints.truckCoversPricesUrl}`, truckPricesController.truckCoversPrice);
router.put(`${endpoints.truckCoversEditPricesUrl}`, truckPricesController.truckCoversEditPrice);
router.get(`${endpoints.truckGondolaPricesUrl}`, truckPricesController.truckGondolaPrices);
router.put(`${endpoints.truckGondolaEditPricesUrl}`, truckPricesController.truckGondolaEditPrice);
router.get(`${endpoints.truckWithShutterPriceUrl}`, truckPricesController.truckWithShutterPrice);
router.put(`${endpoints.truckWithShutterEditPriceUrl}`, truckPricesController.truckWithShutterEditPrice);
router.get(`${endpoints.truckWithoutShutterPriceUrl}`, truckPricesController.truckWithoutShutterPrice);
router.put(`${endpoints.truckWithoutShutterEditPriceUrl}`, truckPricesController.truckWithoutShutterEditPrice);
router.get(`${endpoints.windproofPricesUrl}`, windproofPricesController.windproofCurtainPrices);
router.put(`${endpoints.windProofEditPricesUrl}`, windproofPricesController.windproofCurtainsEditPrice);

module.exports = router;