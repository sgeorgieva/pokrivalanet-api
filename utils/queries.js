const mysql = require("mysql2");
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });

var pool = mysql
  .createPool({
    host: process.env.HOSTING,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DB,
    port: 3306,
    multipleStatements: true,
  })
  .promise();

let queries = {};

queries.allUser = () => {
  return new Promise((resolve, reject) => {
    pool.query("SELECT * FROM users ", (error, users) => {
      if (error) {
        return reject(error);
      }

      return resolve(users);
    });
  });
};

queries.getUserByUsername = async (userName) => {
  return await pool.query(
    "SELECT * FROM users WHERE username = ?",
    [userName],
    (error, users) => {
      if (error) {
        return error;
      } else {
        return users;
      }
    }
  );
};

queries.insertUser = (userName, password) => {
  pool.query(
    "INSERT INTO users (username, password) VALUES (?,  ?)",
    [userName, password],
    (error, results, fields) => {
      if (error) {
        return error;
      } else {
        return results;
      }
    }
  );
};

queries.updateUser = (userName, role, password, id) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "UPDATE users SET username = ?, role= ?, password=? WHERE id = ?",
      [userName, role, password, id],
      (error) => {
        if (error) {
          return reject(error);
        }

        return resolve();
      }
    );
  });
};

queries.deleteUser = (id) => {
  return new Promise((resolve, reject) => {
    pool.query("DELETE FROM users WHERE id = ?", [id], (error) => {
      if (error) {
        return reject(error);
      }

      return resolve(console.log("User deleted"));
    });
  });
};

queries.allTruckCoversPrices = async () => {
  try {
    var results = await pool.query("SELECT * FROM truck_covers_prices");
    return results[0];
  } catch (err) {
    throw err;
  }
};
queries.allTruckGondolaPrices = async () => {
  try {
    var results = await pool.query("SELECT * FROM truck_gondola_prices");
    return results[0];
  } catch (err) {
    throw err;
  }
};
queries.allTruckWithShutterPrices = async () => {
  try {
    var results = await pool.query("SELECT * FROM truck_with_shutters_price");
    return results[0];
  } catch (err) {
    throw err;
  }
};
queries.allTruckWithoutShutterPrices = async () => {
  try {
    var results = await pool.query(
      "SELECT * FROM truck_without_shutters_price"
    );
    return results[0];
  } catch (err) {
    throw err;
  }
};

queries.editTruckCoversPrices = async (data) => {
  try {
    const results = await pool.query(
      `UPDATE truck_covers_prices 
        SET shade_ceiling = ?, 
        semi_trailer = ?, 
        semi_trailer_with_covers = ?, 
        semi_trailer_three_way = ?, 
        ratchet_cover = ?, 
        simple_trailer_cover = ?
      WHERE id = ?`,
      [
        data.shade_ceiling,
        data.semi_trailer,
        data.semi_trailer_with_covers,
        data.semi_trailer_three_way,
        data.ratchet_cover,
        data.simple_trailer_cover,
        data.id,
      ],
      function (error, results, fields) {
        if (error) {
          throw err;
        }
      }
    );

    if (results[0].affectedRows >= 1) {
      const results = await pool.query(`SELECT * FROM truck_covers_prices`);
      return results[0];
    }
  } catch (err) {
    throw err;
  }
};
queries.editTruckGondolaPrices = async (data) => {
  try {
    const results = await pool.query(
      `UPDATE truck_gondola_prices 
        SET longitudinal_pocket_price = ?, 
        fitting_price = ?, 
        assembly_price = ?, 
        tarpaulin_price_1 = ?, 
        tarpaulin_price_2 = ?
      WHERE id = ?`,
      [
        data.longitudinal_pocket_price,
        data.fitting_price,
        data.assembly_price,
        data.tarpaulin_price_1,
        data.tarpaulin_price_2,
        data.id,
      ],
      function (error, results, fields) {
        if (error) {
          throw err;
        }
      }
    );

    if (results[0].affectedRows >= 1) {
      const results = await pool.query(`SELECT * FROM truck_gondola_prices`);
      return results[0];
    }
  } catch (err) {
    throw err;
  }
};

queries.editTruckWithShutterPrices = async (data) => {
  try {
    const results = await pool.query(
      `UPDATE truck_with_shutters_price 
        SET with_shutter_price =?
      WHERE id =?`,
      [data.with_shutter_price, data.id],
      function (error, results, fields) {
        if (error) {
          throw err;
        }
      }
    );

    if (results[0].affectedRows >= 1) {
      const results = await pool.query(
        `SELECT * FROM truck_with_shutters_price`
      );
      return results[0];
    }
  } catch (err) {
    throw err;
  }
};
queries.editTruckWithoutShutterPrices = async (data) => {
  try {
    const results = await pool.query(
      `UPDATE truck_without_shutters_price 
        SET without_shutters_price =?
      WHERE id =?`,
      [data.without_shutters_price, data.id],
      function (error, results, fields) {
        if (error) {
          throw err;
        }
      }
    );

    if (results[0].affectedRows >= 1) {
      const results = await pool.query(
        `SELECT * FROM truck_without_shutters_price`
      );
      return results[0];
    }
  } catch (err) {
    throw err;
  }
};

queries.allWindProofCurtainsPrices = async () => {
  try {
    var results = await pool.query("SELECT * FROM windproof_curtains_prices");
    return results[0];
  } catch (err) {
    throw err;
  }
};
queries.editWindproofCurtainsPrices = async (data) => {
  try {
    const results = await pool.query(
      `UPDATE windproof_curtains_prices 
      SET price_plastic_knobs = ?, 
        price_metal_knobs = ?, 
        price_strap_plates = ?, 
        price_pockets = ?, 
        price_zip = ?, 
        price_knobs = ?, 
        price_curtain = ? WHERE id = ?`,
      [
        data.price_plastic_knobs,
        data.price_metal_knobs,
        data.price_strap_plates,
        data.price_pockets,
        data.price_zip,
        data.price_knobs,
        data.price_curtain,
        data.id,
      ],
      function (error, results, fields) {
        if (error) {
          throw err;
        }
      }
    );

    if (results[0].affectedRows >= 1) {
      const results = await pool.query(
        `SELECT * FROM windproof_curtains_prices`
      );
      return results[0];
    }
  } catch (err) {
    throw err;
  }
};

queries.windproofCurtainsOfferSaveFile = async (data) => {
  try {
    const results = await pool.query(
      `INSERT INTO windproof_curtains SET ?`,
      [data],
      function (error, results, fields) {
        if (error) {
          throw err;
        }
      }
    );
    return results[0].insertId;
  } catch (err) {
    throw err;
  }
};

queries.windproofCurtainsOfferEditFile = async (data) => {
  try {
    const results = await pool.query(
      `UPDATE windproof_curtains SET filename = ?, type = ?, size = ? WHERE id=?`,
      [data.filename, data.type, data.size, data.id],
      function (error, results, fields) {
        if (error) {
          throw err;
        }
      }
    );

    if (results[0].affectedRows >= 1) {
      return results;
    }
  } catch (err) {
    throw err;
  }
};

queries.truckOfferSaveFile = async (data) => {
  try {
    const results = await pool.query(
      `INSERT INTO truck_covers SET ?`,
      [data],
      function (error, results, fields) {
        if (error) {
          throw err;
        }
      }
    );

    return results[0].insertId;
  } catch (err) {
    throw err;
  }
};

queries.truckOfferEditFile = async (data) => {
  try {
    const results = await pool.query(
      `UPDATE truck_covers SET filename = ?, type = ?, size = ? WHERE id=?`,
      [data.filename, data.type, data.size, data.id],
      function (error, results, fields) {
        if (error) {
          throw err;
        }
      }
    );

    if (results[0].affectedRows >= 1) {
      return results;
    }
  } catch (err) {
    throw err;
  }
};

queries.contactSaveMessage = async (data) => {
  try {
    const results = await pool.query(
      `INSERT INTO contacts SET ?`,
      [data],
      function (error, results, fields) {
        if (error) {
          throw err;
        }
      }
    );

    if (results[0].affectedRows >= 1) {
      return "success";
    }
  } catch (err) {
    throw err;
  }
};

module.exports = queries;
