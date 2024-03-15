const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/emailOffer');
const pool = require('../utils/pool');
const pc = require('picocolors');

exports.truckPriceOffer = catchAsync(async (req, res, next) => {
  // console.log('req.body', req.body);
  try {
    if (Object.keys(req.body).length === 0 || Object.keys(req.body.values).length === 0) {
      return res.status(400).send('Empty object provided');
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
      assembly
    } = req?.body?.values;
    const { title } = req?.body;
    var finalPrice;
    let l = Number(length) + 0.6;

    if (title === 'card_text4') {
      let totalLength = 0;
      let priceTarpaulin = 0;
      const longitudinalPocketPrice = 0.3;
      const fittingPrice = 50;
      const assemblyPrice = 1.2;
      let totalWidth = 0;

      let w = Number(width) + 0.8;
      const hood_value = Number(hood);
      const back_cover_value = Number(back_cover);
      const falling_pipe_value = Number(falling_pipe);
      const falling_right_value = Number(falling_right);
      const number_stretches_value = (Number(number_stretches) * 0.2);

      totalWidth = (w + hood_value + back_cover_value + number_stretches_value).toFixed(2);
      totalLength = (l + falling_pipe_value + falling_right_value + number_stretches_value).toFixed(2);

      if (longitudinal_pocket) {
        totalLength = (Number(totalLength) + Number(longitudinalPocketPrice)).toFixed(2);
      }

      if (tarpaulin_type === '680гр/кв.м') {
        priceTarpaulin = 12;
      } else {
        priceTarpaulin = 16;
      }

      finalPrice = (Number(totalWidth) * Number(totalLength) * Number(priceTarpaulin)).toFixed(2);

      if (fitting_right || fitting_left) {
        finalPrice = (Number(finalPrice) + Number(fittingPrice)).toFixed(2);
      }

      if (assembly) {
        finalPrice = (Number(finalPrice) * Number(assemblyPrice)).toFixed(2);
      }
    } else {
      let totalLength = 0;
      let h = 3;
      totalLength = l * h * 15;

      if (title === 'card_text8') {
        finalPrice = (totalLength + 50).toFixed(2);
      } else if (title === 'card_text7') {
        finalPrice = (totalLength + 25).toFixed(2);
      }
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

exports.truckOfferFile = catchAsync(async(req, res, next) => {
  try {
    if (Object.keys(req.body).length === 0) {
      return res.status(400).send('Empty object provided');
    }

    let response = await pool.query("INSERT INTO `truck_covers` SET ?", req.body, function (error, results, fields) {
      pool.release();
      return results;
    });

    // function main(sql) {
    //   return new Promise((resolve, reject) => {
    //       pool.getConnection((err, connection) => {
    //       if (err) throw err;
    //         connection.query(sql, (errt, rows) => {
    //         connection.release(); // return the connection to pool
    //         if (errt) throw err;
    //         // console.log(rows);
    //         resolve(rows);
    //       });
    //     });
    //   });
    // }

    // const response = async function queries() {
    //   let Q = "INSERT INTO `truck_covers` SET ?";
    //   let result = await main(Q);
    //   return result;
    // }

  return res.status(200).json({
    success: true,
    status: "success",
    message: "File information saved sucessfully!",
    offerId: response[0].insertId
  });
  } catch (error) {
    console.error('error', error);
    return res.status(400).json({
      success: false,
      message: error
    });
  }
});

exports.truckOfferComparedFiles = catchAsync(async (req, res, next) => {
  // console.log('req', req.body);
  try {
    const newData = req.body;

    if (!newData.id || !newData.filename || !newData.type || !newData.size) {
      return res.status(400).send('Missing required parameters');
    }

    let response = await poolObject.pool.query('UPDATE truck_covers SET filename = ?, type = ?, size = ? WHERE id = ?', [newData.id, newData.filename, newData.type, newData.size],
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
    return res.status(500).json({
      success: false,
      message: error
    });
  }
});

exports.truckOfferEmail = catchAsync(async (req, res, next) => {
  // console.log('req', req.body);

  if (Object.keys(req.body).length === 0) {
    return res.status(400).send('Empty object provided');
  }

  try {
    sendEmail({
      from: 'Клиент',
      subject: 'Оферта за покривало',
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