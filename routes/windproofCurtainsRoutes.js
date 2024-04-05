const express = require('express');
const windproofCurtainsController = require('../controllers/windproofCurtainsController');
const endpoints = require('../utils/endpoints');

const router = express.Router();

router.post(`${endpoints.windproofPriceUrl}`, windproofCurtainsController.windproofCurtainsPriceOffer);
router.post(`${endpoints.windproofFileUrl}`, windproofCurtainsController.windproofCurtainsOfferFile);
router.put(`${endpoints.windproofComparedFilesUrl}`, windproofCurtainsController.windproofCurtainsComparedFiles);
router.post(`${endpoints.windproofSendEmailUrl}`, windproofCurtainsController.windproofCurtainsOfferEmail);

module.exports = router;