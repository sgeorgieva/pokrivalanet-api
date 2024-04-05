const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const { sql } = require("../utils/sql");
const iterateEntries = require("../utils/iterateEntries");

exports.truckCoversPrice = catchAsync(async (req, res, next) => {
  try {
    const prices = await sql.allTruckCoversPrices();
    const modifiedPrices = iterateEntries(prices[0], (price) => {
      return price.toLocaleString("en-US", { minimumFractionDigits: 2 });
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
    const prices = await sql.allTruckGondolaPrices();
    const modifiedPrices = iterateEntries(prices[0], (price) => {
      return price.toLocaleString("en-US", { minimumFractionDigits: 2 });
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
    const prices = await sql.allTruckWithShutterPrices();
    const modifiedPrices = iterateEntries(prices[0], (price) => {
      return price.toLocaleString("en-US", { minimumFractionDigits: 2 });
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
    const prices = await sql.allTruckWithoutShutterPrices();
    const modifiedPrices = iterateEntries(prices[0], (price) => {
      return price.toLocaleString("en-US", { minimumFractionDigits: 2 });
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

    await sql.editTruckCoversPrices(newData);
    const results = await sql.allTruckCoversPrices();

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

    await sql.editTruckGondolaPrices(newData);
    const results = await sql.allTruckGondolaPrices();

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

    if (!newData.id || !newData.with_shutter_price) {
      return next(new AppError("Missing required parameters"), 400);
    }

    await sql.editTruckWithShutterPrices(newData);
    const results = await sql.allTruckWithShutterPrices();

    return res.status(200).json({
      success: true,
      status: "success",
      message: "Truck with shutter price edited sucessfully!",
      result: results[0],
    });
  } catch (error) {
    return next(new AppError(error), 500);
  }
});

exports.truckWithoutShutterEditPrice = catchAsync(async (req, res, next) => {
  try {
    const newData = req.body;

    if (!newData.id || !newData.without_shutters_price) {
      return next(new AppError("Missing required parameters"), 400);
    }

    await sql.editTruckWithoutShutterPrices(newData);
    const results = await sql.allTruckWithoutShutterPrices();

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
