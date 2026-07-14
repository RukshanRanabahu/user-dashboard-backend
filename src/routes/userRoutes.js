const express = require("express");
const router = express.Router();

const {
  getUsers,
  getAllUsers,
  createUser,
} = require("../controllers/userController");

router.get("/", getUsers);
router.get("/all", getAllUsers);
router.post("/", createUser);

module.exports = router;
