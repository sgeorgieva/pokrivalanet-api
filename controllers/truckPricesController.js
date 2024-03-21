const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const pool2 = require("../utils/pool2");
const iterateEntries = require("../utils/iterateEntries");

exports.truckCoversPrice = catchAsync(async (req, res, next) => {
  try {
    const prices = await pool2.allTruckCoversPrices();
    const modifiedPrices = iterateEntries(prices[0], (price) => {
      return price.toLocaleString("en-US");
    });

    return res.status(200).json({
      success: true,
      status: "success",
      result: modifiedPrices,
    });
  } catch (error) {
    return next(new AppError(error), 500);
  }
});

exports.truckGondolaPrices = catchAsync(async (req, res, next) => {
  try {
    const prices = await pool2.allTruckGondolaPrices();
    const modifiedPrices = iterateEntries(prices[0], (price) => {
      return price.toLocaleString("en-US");
    });

    return res.status(200).json({
      success: true,
      status: "success",
      result: modifiedPrices,
    });
  } catch (error) {
    return next(new AppError(error), 500);
  }
});

exports.truckShutterPrices = catchAsync(async (req, res, next) => {
  try {
    const prices = await pool2.allTruckShutterPrices();
    const modifiedPrices = iterateEntries(prices[0], (price) => {
      return price.toLocaleString("en-US");
    });

    return res.status(200).json({
      success: true,
      status: "success",
      result: modifiedPrices,
    });
  } catch (error) {
    return next(new AppError(error), 500);
  }
});

exports.truckCoversEditPrice = catchAsync(async (req, res, next) => {
  try {
    const newData = req.body;

    if (
      !newData.id &&
      !newData.shade_ceiling &&
      !newData.semi_trailer &&
      !newData.semi_trailer_with_covers &&
      !newData.semi_trailer_three_way &&
      !newData.ratchet_cover &&
      !newData.simple_trailer_cover
    ) {
      return next(new AppError("Missing required parameters"), 400);
    }

    await pool2.editTruckCoversPrices(newData);
    const results = await pool2.allWindProofCurtainsPrices();
    console.log('results', results);

    return res.status(200).json({
      success: true,
      status: "success",
      message: "Truck cover prices edited sucessfully!",
      result: results,
    });
  } catch (error) {
    return next(new AppError(error), 500);
  }
});
