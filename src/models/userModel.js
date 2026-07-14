const db = require("../db");

const getAllUsers = (callback) => {
  const query = "SELECT * FROM users";
  db.query(query, callback);
};

const getUsers = (searchValue, limit, offset, callback) => {
  const query = `
    SELECT *
    FROM users
    WHERE
      first_name LIKE ?
      OR last_name LIKE ?
      OR email LIKE ?
      OR city LIKE ?
    LIMIT ?
    OFFSET ?
  `;

  db.query(
    query,
    [searchValue, searchValue, searchValue, searchValue, limit, offset],
    callback,
  );
};

// Count users
const countUsers = (searchValue, callback) => {
  const query = `
    SELECT COUNT(*) AS total
    FROM users
    WHERE
      first_name LIKE ?
      OR last_name LIKE ?
      OR email LIKE ?
      OR city LIKE ?
  `;

  db.query(
    query,
    [searchValue, searchValue, searchValue, searchValue],
    callback,
  );
};

// Create user
const createUser = (user, callback) => {
  const query = `
    INSERT INTO users
    (
      first_name,
      last_name,
      email,
      phone,
      age,
      city
    )
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [
      user.first_name,
      user.last_name,
      user.email,
      user.phone,
      user.age,
      user.city,
    ],
    callback,
  );
};

module.exports = {
  getUsers,
  getAllUsers,
  countUsers,
  createUser,
};
