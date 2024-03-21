const express = require('express');
const truckController = require('../controllers/truckController');
const endpoints = require('../utils/endpoints');

const router = express.Router();

router.post(`${endpoints.truckGondolaPriceUrl}`, truckController.truckGondnolaPriceOffer);
router.post(`${endpoints.truckShutterPriceUrl}`, truckController.truckShutterPriceOffer);
router.post(`${endpoints.truckFileUrl}`, truckController.truckOfferFile);
router.put(`${endpoints.truckComparedFilesUrl}`, truckController.truckOfferComparedFiles);
router.post(`${endpoints.truckSendEmailUrl}`, truckController.truckOfferEmail);

module.exports = router;
