const userModel = require("../models/userModel");

// Get all users without pagination and search
const getAllUsers = (req, res) => {
  userModel.getAllUsers((err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error" });
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
  const searchValue = `%${search}%`;

  userModel.countUsers(searchValue, (countError, countResult) => {
    if (countError) {
      return res.status(500).json({
        message: "Database error",
      });
    }

    const totalUsers = countResult[0].total;

    userModel.getUsers(searchValue, limit, offset, (error, results) => {
      if (error) {
        return res.status(500).json({
          message: "Database error",
        });
      }

      res.json({
        data: results,
        pagination: {
          page,
          limit,
          total: totalUsers,
          totalPages: Math.ceil(totalUsers / limit),
        },
      });
    });
  });
};

// Create a new user
const createUser = (req, res) => {
  const { first_name, last_name, email, phone, age, city } = req.body;

  const user = {
    first_name,
    last_name,
    email,
    phone,
    age,
    city,
  };

  userModel.createUser(user, (error, result) => {
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
        ...user,
      },
    });
  });
};

module.exports = {
  getUsers,
  getAllUsers,
  createUser,
};
