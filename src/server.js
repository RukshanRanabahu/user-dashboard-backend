const express = require("express");
const cors = require("cors");

require("./db");

const userRoutes = require("./routes/userRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
    res.send("API is running");
});


const PORT = 5000;


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});