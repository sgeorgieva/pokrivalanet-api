const cors = require('cors');
const express = require('express');
const cookieParser = require('cookie-parser');
const authController = require('../controllers/authController');
const endpoints = require('../utils/endpoints');

const router = express.Router();

const corsOptions = {
  origin: '*',
  credentials: true,
  optionSuccessStatus: 201,
};

router.use(cookieParser());

// enable CORS using npm package
router.use(cors(corsOptions));

router.post(`${endpoints.register}`, authController.register);
router.post(`${endpoints.login}`, authController.login);
router.get(`${endpoints.logout}`, authController.logout);

module.exports = router;