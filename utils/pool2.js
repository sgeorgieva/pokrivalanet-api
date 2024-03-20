const mysql = require('mysql2');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

var pool = mysql.createPool({
  host: process.env.HOSTING,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DB,
  port: 3306,
  multipleStatements: true
}).promise();
 
// ***Requests to the User table ***
let pool2 = {};
 
pool2.allUser = () => {
  return new Promise((resolve, reject)=> {
    pool.query('SELECT * FROM users ', (error, users) => {
      if (error) {
        return reject(error);
      }

      return resolve(users);
    });
  });
};
 
 
pool2.getUserByUsername = async(userName) => {
  return await pool.query('SELECT * FROM users WHERE username = ?', [userName], (error, users) => {
    if (error) {
      return error;
    } else {
      return users;
    }
  });
};
 
 
pool2.insertUser = (userName, password) => {
  pool.query('INSERT INTO users (username, password) VALUES (?,  ?)', [userName, password], (error, results, fields) => {
    if (error) {
      return error;
    } else {
      return results;
    }
  });
};
 
 
pool2.updateUser = (userName, role, password, id) => {
  return new Promise((resolve, reject)=>{
    pool.query('UPDATE users SET username = ?, role= ?, password=? WHERE id = ?', [userName, role, password, id], (error) => {
      if (error) {
        return reject(error);
      }
        
      return resolve();
    });
  });
};
 
 
pool2.deleteUser = (id) => {
  return new Promise((resolve, reject)=>{
    pool.query('DELETE FROM users WHERE id = ?', [id], (error) => {
      if (error) {
        return reject(error);
      }
      
      return resolve(console.log("User deleted"));
    });
  });
};

module.exports = pool2;