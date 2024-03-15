const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const pool = require('../utils/pool');
const sendEmail = require('../utils/emailOffer');

exports.windproofCurtainsPriceOffer = catchAsync(async (req, res, next) => {
  try {
    if (Object.keys(req.body).length === 0 || Object.keys(req.body.values).length === 0) {
      return res.status(400).send('Empty object provided');
    }
    const {
      width,
      height,
      thick,
      edge,
      hardwareText,
      zips,
      lower_apron,
      pipe_pocket,
      knobs,
      curtain_have_door
    } = req?.body?.values

    let priceThick = 0;
    let finalPrice = 0;
    let hardwareTextPrice = 0;
    let plasticKnobsPrice = 2.5;
    let metalKnobsPrice = 4.5;
    let strapPlatesPrice = 12;
    let pockets = 0.5;
    let zipPrice = 15;

    const w = Number(width);
    const h = Number(height);
    const t = Number(thick);
    const e = (Number(edge) * 2) / 100;

    if (t === 0.8) {
      priceThick = 24;
    } else {
      priceThick = 20;
    }

    finalPrice = ((w + e) * (h + e));
    finalPrice = (finalPrice.toFixed(2) * priceThick).toFixed(2);

    if (hardwareText === 'plastic_knobs') {
      hardwareTextPrice = (((2 * h) / 0.35) * plasticKnobsPrice).toFixed(2);
      finalPrice = Number(finalPrice) + Number(hardwareTextPrice);
    }

    if (hardwareText === 'metal_knobs') {
      hardwareTextPrice = (((2 * h) / 0.35) * metalKnobsPrice).toFixed(2);
      finalPrice = Number(finalPrice) + Number(hardwareTextPrice);
    }

    if (hardwareText === 'strap_plates') {
      hardwareTextPrice = ((2 * h) * strapPlatesPrice).toFixed(2);
      finalPrice = Number(finalPrice) + Number(hardwareTextPrice);
    }

    if (pockets === 'pockets') {
      hardwareTextPrice = (((2 * h) / 0.15) * pockets).toFixed(2);
      finalPrice = Number(finalPrice) + Number(hardwareTextPrice);
    }

    if (zips === true) {
      hardwareTextPrice = (w * zipPrice).toFixed(2);
      finalPrice = Number(finalPrice) + Number(hardwareTextPrice);
    }

    if (lower_apron === true) {
      hardwareTextPrice = ((w * 0.35) * strapPlatesPrice).toFixed(2);
      finalPrice = Number(finalPrice) + Number(hardwareTextPrice);
    }

    if (pipe_pocket === true) {
      hardwareTextPrice = ((w * 0.20) * strapPlatesPrice).toFixed(2);
      finalPrice = Number(finalPrice) + Number(hardwareTextPrice);
    }

    if (knobs === true) {
      finalPrice = (Number(finalPrice) + 9).toFixed(2);
    }

    if (curtain_have_door === true) {
      finalPrice = (Number(finalPrice) + 60).toFixed(2);
    }

    res.status(200).json({
      'status': 'success',
      'result': finalPrice
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error
    });
  }
});

exports.windproofCurtainsOfferFile = catchAsync(async (req, res, next) => {
  try {
    if (Object.keys(req.body).length === 0) {
      return res.status(400).send('Empty object provided');
    }

    let response = await pool.query("INSERT INTO `windproof_curtains` SET ?", req.body, function (error, results, fields) {
      pool.release();
      return results;
    });
    return res.status(200).json({
      success: true,
      status: "success",
      message: "File information saved sucessfully!",
      offerId: response[0].insertId
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error
    });
  }
});

exports.windproofCurtainsComparedFiles = catchAsync(async (req, res, next) => {
  try {
    const newData = req.body;

    if (!newData.id || !newData.filename || !newData.type || !newData.size) {
      return res.status(400).send('Missing required parameters');
    }

    let response = await pool.query('UPDATE windproof_curtains SET filename = ?,type = ?,size = ? WHERE id=?', [newData.id, newData.filename, newData.type, newData.size],
      function (error, results, fields) {
        pool.release();
        return results;
      });
    return res.status(200).json({
      success: true,
      status: "success",
      message: "File information edited sucessfully!",
      offerId: response[0].insertId
    });
  } catch (error) {
    console.log('error', error);
    return res.status(500).json({
      success: false,
      message: error
    });
  }
});

exports.windproofCurtainsOfferEmail = catchAsync(async (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return res.status(400).send('Empty object provided');
  }

  try {
    sendEmail({
      from: 'Клиент',
      subject: 'Оферта за ветроупорна завеса',
      to: process.env.USER_EMAIL,
      html: `<h1>Оферта от клиент</h1>`,
      attachments: [
        {
          filename: req.body.filename,
          path: req.body.file
        }
      ]
    });

    res.status(200).json({
      status: 'success',
      message:
        'Thanks for your messege!\n Soon some of our team will respond you.'
    });
  } catch (err) {
    return next(
      new AppError('There was an error sending the email. Try again later!'),
      500
    );
  }
});