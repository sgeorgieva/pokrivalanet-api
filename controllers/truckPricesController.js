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

exports.truckWithShutterPrice = catchAsync(async (req, res, next) => {
  try {
    const prices = await pool2.allTruckWithShutterPrices();
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

exports.truckWithoutShutterPrice = catchAsync(async (req, res, next) => {
  try {
    const prices = await pool2.allTruckWithoutShutterPrices();
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
      !newData.id ||
      !newData.shade_ceiling ||
      !newData.semi_trailer ||
      !newData.semi_trailer_with_covers ||
      !newData.semi_trailer_three_way ||
      !newData.ratchet_cover ||
      !newData.simple_trailer_cover
    ) {
      return next(new AppError("Missing required parameters"), 400);
    }

    await pool2.editTruckCoversPrices(newData);
    const results = await pool2.allTruckCoversPrices();

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

exports.truckGondolaEditPrice = catchAsync(async (req, res, next) => { 
  try {
    const newData = req.body;

    if (
      !newData.id ||
      !newData.longitudinal_pocket_price ||
      !newData.fitting_price ||
      !newData.assembly_price ||
      !newData.tarpaulin_price_1 ||
      !newData.tarpaulin_price_2
    ) {
      return next(new AppError("Missing required parameters"), 400);
    }

    await pool2.editTruckGondolaPrices(newData);
    const results = await pool2.allTruckGondolaPrices();

    return res.status(200).json({
      success: true,
      status: "success",
      message: "Truck gondola prices edited sucessfully!",
      result: results,
    });
  } catch (error) {
    return next(new AppError(error), 500);
  }
});

exports.truckWithShutterEditPrice = catchAsync(async (req, res, next) => { 
  try {
    const newData = req.body;
    console.log('newData', newData);

    if (
      !newData.id ||
      !newData.with_shutter_price
    ) {
      return next(new AppError("Missing required parameters"), 400);
    }

    await pool2.editTruckWithShutterPrices(newData);
    const results = await pool2.allTruckWithShutterPrices();

    return res.status(200).json({
      success: true,
      status: "success",
      message: "Truck with shutter price edited sucessfully!",
      result: results,
    });
  } catch (error) {
    return next(new AppError(error), 500);
  }
});

exports.truckWithoutShutterEditPrice = catchAsync(async (req, res, next) => { 
  try {
    const newData = req.body;

    if (
      !newData.id ||
      !newData.without_shutters_price
    ) {
      return next(new AppError("Missing required parameters"), 400);
    }

    await pool2.editTruckWithoutShutterPrices(newData);
    const results = await pool2.allTruckWithoutShutterPrices();

    return res.status(200).json({
      success: true,
      status: "success",
      message: "Truck without shutter price edited sucessfully!",
      result: results,
    });
  } catch (error) {
    return next(new AppError(error), 500);
  }
});
