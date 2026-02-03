/*


Summary: The users.js is used create functions and what it does to the Users database.
*/

const db = require("./databaseConfig");
var config = require("../config.js");
var jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const saltRounds = 10;

var userDB = {
  //ENDPOINT 1
  //Get all users
  getUser: function (callback) {
    var dbConn = db.getConnection();

    // Connect to MySQL DB
    dbConn.connect(function (err) {
      if (err) {
        return callback(err, null);
      } else {
        var getUserSql = `select userid, username, email, password, type, profile_pic_url,
                                    DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') AS created_at FROM users`;

        dbConn.query(getUserSql, [], function (err, results) {
          if (err) {
            dbConn.end();
            return callback(err, null);
          } else {
            dbConn.end();
            return callback(null, results);
          }
        });
      }
    });
  },

  //ENDPOINT 2
  //Add a new user
  insertUser: function (
    username,
    email,
    password,
    type,
    profile_pic_url,
    callback,
  ) {
    var dbConn = db.getConnection();

    dbConn.connect(function (err) {
      if (err) {
        return callback(err, null);
      } else {
        // HASH the password before inserting into the database
        bcrypt.hash(password, saltRounds, function (err, hash) {
          if (err) {
            dbConn.end();
            return callback(err, null);
          }

          var insertUserSql =
            "insert into users(username,email,password,type,profile_pic_url) values(?,?,?,?,?)";
          dbConn.query(
            insertUserSql,
            [username, email, hash, type, profile_pic_url], // Store the hash, not the password
            function (err, results) {
              dbConn.end();
              return callback(err, results);
            },
          );
        });
      }
    });
  },

  // ENDPOINT 3
  // Get user by user id
  getUserByUserid: function (userid, callback) {
    var dbConn = db.getConnection();

    dbConn.connect(function (err) {
      if (err) {
        return callback(err, null);
      } else {
        // FIX: Use '?' as a placeholder instead of ${userid}
        var getUserByUserIDSql = `SELECT userid, username, email, password, type, profile_pic_url,
                                        DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') AS created_at 
                                        FROM users WHERE userid = ?;`;

        // FIX: Pass the userid variable inside the array [userid]
        // The database driver will now safely escape this value.
        dbConn.query(getUserByUserIDSql, [userid], function (err, results) {
          if (err) {
            dbConn.end();
            return callback(err, null);
          } else {
            dbConn.end();
            return callback(null, results);
          }
        });
      }
    });
  },

  //Login user by email and password
  loginUser: function (email, password, callback) {
    var dbConn = db.getConnection();

    dbConn.connect(function (err) {
      if (err) {
        return callback(err, null);
      } else {
        // Query by email only to retrieve the stored hash
        var sql = "select * from users where email=?";

        dbConn.query(sql, [email], function (err, result) {
          dbConn.end();

          if (err) {
            return callback(err, null, null);
          } else if (result.length == 1) {
            const user = result[0];

            // SECURE COMPARISON: Compare plaintext input with stored hash
            bcrypt.compare(password, user.password, function (err, isMatch) {
              if (err) {
                return callback(err, null, null);
              }

              if (isMatch) {
                var token = jwt.sign(
                  { userid: user.userid, type: user.type },
                  config.key,
                  { expiresIn: 86400 },
                );
                return callback(null, token, result);
              } else {
                // Password does not match
                var err2 = new Error("UserID/Password does not match.");
                err2.statusCode = 401; // Use 401 for Auth failure
                return callback(err2, null, null);
              }
            });
          } else {
            // Email not found
            var err2 = new Error("UserID/Password does not match.");
            err2.statusCode = 401;
            return callback(err2, null, null);
          }
        });
      }
    });
  },
};


module.exports = userDB;
