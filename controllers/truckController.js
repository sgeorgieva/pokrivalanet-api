const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const sendEmail = require("../utils/emailOffer");
const queries = require("../utils/queries");

exports.truckGondnolaPriceOffer = catchAsync(async (req, res, next) => {
  try {
    if (
      Object.keys(req.body).length === 0 ||
      Object.keys(req.body.values).length === 0
    ) {
      next(new AppError("Empty object provided"), 400);
    }

    const {
      width,
      length,
      hood,
      back_cover,
      falling_pipe,
      falling_right,
      number_stretches,
      date_manufacture,
      tarpaulin_type,
      longitudinal_pocket,
      fitting_left,
      fitting_right,
      assembly,
    } = req?.body?.values;

    const prices = await queries.allTruckGondolaPrices();

    if (Object.keys(prices).length > 0) {
      const {
        longitudinal_pocket_price,
        fitting_price,
        assembly_price,
        tarpaulin_price_1,
        tarpaulin_price_2,
      } = prices[0];
      const priceTarpaulin =
        tarpaulin_type === "680гр/кв.м" ? tarpaulin_price_1 : tarpaulin_price_2;
      let l = Number(length) + 0.6;
      let w = Number(width) + 0.8;
      const hood_value = Number(hood);
      const back_cover_value = Number(back_cover);
      const falling_pipe_value = Number(falling_pipe);
      const falling_right_value = Number(falling_right);
      const number_stretches_value = Number(number_stretches) * 0.2;
      let totalWidth = 0;
      let totalLength = 0;
      var finalPrice;

      totalWidth = (
        w +
        hood_value +
        back_cover_value +
        number_stretches_value
      ).toFixed(2);
      totalLength = (
        l +
        falling_pipe_value +
        falling_right_value +
        number_stretches_value
      ).toFixed(2);

      if (longitudinal_pocket) {
        totalLength = (
          Number(totalLength) + Number(longitudinal_pocket_price)
        ).toFixed(2);
      }

      finalPrice = (
        Number(totalWidth) *
        Number(totalLength) *
        Number(priceTarpaulin)
      ).toFixed(2);

      if (fitting_right || fitting_left) {
        finalPrice = (Number(finalPrice) + Number(fitting_price)).toFixed(2);
      }

      if (assembly) {
        finalPrice = (Number(finalPrice) * Number(assembly_price)).toFixed(2);
      }

      res.status(200).json({
        status: "success",
        result: finalPrice,
      });
    }
  } catch (error) {
    return next(new AppError(error), 400);
  }
});

exports.truckShutterPriceOffer = catchAsync(async (req, res, next) => {
  try {
    if (
      Object.keys(req.body).length === 0 ||
      Object.keys(req.body.values).length === 0
    ) {
      next(new AppError("Empty object provided"), 400);
    }

    const { title } = req?.body;
    const { length } = req.body.values;
    const l = Number(length) + 0.6;
    const h = 3;
    const totalLength = l * h * 15;
    var finalPrice;
    let price;

    if (title === "card_text8") {
      price = await queries.allTruckWithoutShutterPrices();
      finalPrice = (totalLength + price[0].without_shutters_price).toFixed(2);
    } else {
      price = await queries.allTruckWithShutterPrices();
      finalPrice = (totalLength + price[0].with_shutter_price).toFixed(2);
    }

    res.status(200).json({
      status: "success",
      result: finalPrice,
    });
  } catch (error) {
    return next(new AppError(error), 400);
  }
});

exports.truckOfferFile = catchAsync(async (req, res, next) => {
  try {
    if (Object.keys(req.body).length === 0) {
      next(new AppError("Empty object provided"), 400);
    }

    const response = await queries.truckOfferSaveFile(req.body);

    return res.status(200).json({
      success: true,
      status: "success",
      message: "File information saved sucessfully!",
      offerId: response,
    });
  } catch (error) {
    // console.error("error", error);
    return next(new AppError(error), 500);
  }
});

exports.truckOfferComparedFiles = catchAsync(async (req, res, next) => {
  try {
    const newData = req.body;

    if (!newData.id || !newData.filename || !newData.type || !newData.size) {
      return next(new AppError("Missing required parameters"), 400);
    }

    await queries.truckOfferEditFile(req.body);

    return res.status(200).json({
      success: true,
      status: "success",
      message: "File information edited sucessfully!",
    });
  } catch (error) {
    return next(new AppError(error), 500);
  }
});

exports.truckOfferEmail = catchAsync(async (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return next(new AppError("Empty object provided"), 400);
  }

  try {
    sendEmail({
      from: "Клиент",
      subject: "Оферта за покривало",
      to: process.env.USER_EMAIL,
      html: `<h1>Оферта от клиент</h1>`,
      attachments: [
        {
          filename: req.body.filename,
          path: req.body.file,
        },
      ],
    });

    res.status(200).json({
      status: "success",
      message:
        "Thanks for your messege!\n Soon some of our team will respond you.",
    });
  } catch (err) {
    return next(
      new AppError("There was an error sending the email. Try again later!"),
      500
    );
  }
});
