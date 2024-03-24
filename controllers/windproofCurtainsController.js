const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const sql = require('../utils/sql');
const sendEmail = require('../utils/emailOffer');

exports.windproofCurtainsPriceOffer = catchAsync(async (req, res, next) => {
  try {
    if (Object.keys(req.body).length === 0 || Object.keys(req.body.values).length === 0) {
      return next(
        new AppError("Empty object provided"),
        400
      );
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
    } = req?.body?.values;

    const prices = await sql.allWindProofCurtainsPrices();

    if (Object.keys(prices).length > 0) {
      const {
        price_thick_1,
        price_thick_2,
        price_plastic_knobs,
        price_metal_knobs,
        price_strap_plates,
        price_pockets,
        price_zip,
        price_knobs,
        price_curtain
      } = prices[0];
      const w = Number(width);
      const h = Number(height);
      const e = (Number(edge) * 2) / 100;
      let priceThick = Number(thick) === 0.8 ? price_thick_1 : price_thick_2;
      let hardwareTextPrice = 0;
      let finalPrice = 0;

      finalPrice = ((w + e) * (h + e));
      finalPrice = (finalPrice.toFixed(2) * priceThick).toFixed(2);

      if (hardwareText === 'plastic_knobs') {
        hardwareTextPrice = (((2 * h) / 0.35) * price_plastic_knobs).toFixed(2);
        finalPrice = Number(finalPrice) + Number(hardwareTextPrice);
      }

      if (hardwareText === 'metal_knobs') {
        hardwareTextPrice = (((2 * h) / 0.35) * price_metal_knobs).toFixed(2);
        finalPrice = Number(finalPrice) + Number(hardwareTextPrice);
      }

      if (hardwareText === 'strap_plates') {
        hardwareTextPrice = ((2 * h) * price_strap_plates).toFixed(2);
        finalPrice = Number(finalPrice) + Number(hardwareTextPrice);
      }

      if (hardwareText === 'pockets') {
        hardwareTextPrice = (((2 * h) / 0.15) * price_pockets).toFixed(2);
        finalPrice = Number(finalPrice) + Number(hardwareTextPrice);
      }

      if (zips === true) {
        hardwareTextPrice = (w * price_zip).toFixed(2);
        finalPrice = Number(finalPrice) + Number(hardwareTextPrice);
      }

      if (lower_apron === true) {
        hardwareTextPrice = ((w * 0.35) * price_strap_plates).toFixed(2);
        finalPrice = Number(finalPrice) + Number(hardwareTextPrice);
      }

      if (pipe_pocket === true) {
        hardwareTextPrice = ((w * 0.20) * price_strap_plates).toFixed(2);
        finalPrice = Number(finalPrice) + Number(hardwareTextPrice);
      }

      if (knobs === true) {
        finalPrice = (Number(finalPrice) + price_knobs).toFixed(2);
      }

      if (curtain_have_door === true) {
        finalPrice = (Number(finalPrice) + price_curtain).toFixed(2);
      }

      res.status(200).json({
        'status': 'success',
        'result': finalPrice
      });
    }
  } catch (error) {
    return next(
      new AppError(error),
      500
    );
  }
});

exports.windproofCurtainsOfferFile = catchAsync(async (req, res, next) => {
  try {
    if (Object.keys(req.body).length === 0) {
      return next(
        new AppError("Empty object provided"),
        400
      );
    }

    const response = await sql.windproofCurtainsOfferSaveFile(req.body);
   
    return res.status(200).json({
      success: true,
      status: "success",
      message: "File information saved sucessfully!",
      offerId: response
    });
  } catch (error) {
    return next(
      new AppError(error),
      500
    );
  }
});

exports.windproofCurtainsComparedFiles = catchAsync(async (req, res, next) => {
  try {
    const { id, filename, type, size } = req.body;

    if (!id || !filename || !type || !size) {
      return next(
        new AppError("Missing required parameters"),
        400
      );
    }

    await sql.windproofCurtainsOfferEditFile(req.body);
    
    return res.status(200).json({
      success: true,
      status: "success",
      message: "File information edited sucessfully!"
    });
  } catch (error) {
    return next(
      new AppError(error),
      500
    );
  }
});

exports.windproofCurtainsOfferEmail = catchAsync(async (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return next(
      new AppError("Empty object provided"),
      400
    );
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