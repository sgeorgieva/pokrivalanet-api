const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const iterateEntries = require("../utils/iterateEntries");
const sql = require("../utils/sql");

exports.windproofCurtainPrices = catchAsync(async (req, res, next) => {
  try {
    const prices = await sql.allWindProofCurtainsPrices();
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

exports.windproofCurtainsEditPrice = catchAsync(async (req, res, next) => {
  try {
    const newData = req.body;

    if (
      !newData.id &&
      !newData.price_plastic_knobs &&
      !newData.price_metal_knobs &&
      !newData.price_strap_plates &&
      !newData.price_pockets &&
      !newData.price_zip &&
      !newData.price_knobs &&
      !newData.price_curtain
    ) {
      return next(new AppError("Missing required parameters"), 400);
    }

    await sql.editWindproofCurtainsPrices(newData);
    const results = await sql.allWindProofCurtainsPrices();

    return res.status(200).json({
      success: true,
      status: "success",
      message: "Windproof curtains prices edited sucessfully!",
      result: results
    });
  } catch (error) {
    return next(new AppError(error), 500);
  }
});