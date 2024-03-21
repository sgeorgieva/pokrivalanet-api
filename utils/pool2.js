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

// ***Requests to the User table ***
let pool2 = {};

pool2.allUser = () => {
  return new Promise((resolve, reject) => {
    pool.query("SELECT * FROM users ", (error, users) => {
      if (error) {
        return reject(error);
      }

      return resolve(users);
    });
  });
};

pool2.getUserByUsername = async (userName) => {
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

pool2.insertUser = (userName, password) => {
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

pool2.updateUser = (userName, role, password, id) => {
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

pool2.deleteUser = (id) => {
  return new Promise((resolve, reject) => {
    pool.query("DELETE FROM users WHERE id = ?", [id], (error) => {
      if (error) {
        return reject(error);
      }

      return resolve(console.log("User deleted"));
    });
  });
};

pool2.allTruckCoversPrices = async () => {
  try {
    var results = await pool.query("SELECT * FROM truck_covers_prices");
    return results[0];
  } catch (err) {
    throw err;
  }
};
pool2.allTruckGondolaPrices = async () => {
  try {
    var results = await pool.query("SELECT * FROM truck_gondola_prices");
    return results[0];
  } catch (err) {
    throw err;
  }
};
pool2.allTruckShutterPrices = async () => {
  try {
    var results = await pool.query("SELECT * FROM truck_shutter_prices");
    return results[0];
  } catch (err) {
    throw err;
  }
};

pool2.editTruckCoversPrices = async (data) => {
  console.log("data", data);

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
        data.id
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
pool2.allWindProofCurtainsPrices = async () => {
  try {
    var results = await pool.query("SELECT * FROM windproof_curtains_prices");
    return results[0];
  } catch (err) {
    throw err;
  }
};
pool2.editWindproofCurtainsPrices = async (data) => {
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
        data.id
      ],
      function (error, results, fields) {
        if (error) {
          throw err;
        }
      }
    );

    if (results[0].affectedRows >= 1) {
      const results = await pool.query(`SELECT * FROM windproof_curtains_prices`);
      return results[0];
    }
  } catch (err) {
    throw err;
  }
};

module.exports = pool2;
