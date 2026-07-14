const db = require("../db");

// Get all users without pagination and search
const getAllUsers = (req, res) => {
  const query = "SELECT * FROM users";

  db.query(query, (err, results) => {
    if (err) {
      console.log(err);

      return res.status(500).json({
        message: "Database error",
      });
    }

    res.json({
      data: results,
    });
  });
};

// Get users with pagination and search
const getUsers = (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 5;
  const search = req.query.search || "";

  const offset = (page - 1) * limit;

  const countQuery = `
    SELECT COUNT(*) AS total 
    FROM users
    WHERE 
        first_name LIKE ?
        OR last_name LIKE ?
        OR email LIKE ?
        OR city LIKE ?
`;
  const searchValue = `%${search}%`;

  db.query(
    countQuery,
    [searchValue, searchValue, searchValue, searchValue],
    (countError, countResult) => {
      if (countError) {
        return res.status(500).json({
          message: "Database error",
        });
      }

      const totalUsers = countResult[0].total;

      const dataQuery = `
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
        dataQuery,
        [searchValue, searchValue, searchValue, searchValue, limit, offset],
        (error, results) => {
          if (error) {
            return res.status(500).json({
              message: "Database error",
            });
          }

          res.json({
            data: results,

            pagination: {
              page: page,
              limit: limit,
              total: totalUsers,
              totalPages: Math.ceil(totalUsers / limit),
            },
          });
        },
      );
    },
  );
};

// Create a new user
const createUser = (req, res) => {
  const { first_name, last_name, email, phone, age, city } = req.body;

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
    [first_name, last_name, email, phone, age, city],
    (error, result) => {
      if (error) {
        console.log(error);

        return res.status(500).json({
          message: "Failed to create user",
        });
      }

      res.status(201).json({
        message: "User created successfully",

        user: {
          id: result.insertId,
          first_name,
          last_name,
          email,
          phone,
          age,
          city,
        },
      });
    },
  );
};

module.exports = {
  getUsers,
  getAllUsers,
  createUser,
};
