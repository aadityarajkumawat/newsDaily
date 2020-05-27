const express = require("express");
const connectDB = require("./config/db");
const path = require("path");

const app = express();

// Connect to a Database
connectDB();

// Init Middleware
app.use(express.json({ extended: true }));

// Defining Routes
app.use("/api/users", require("./routes/users"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/news", require("./routes/news"));
app.use("/api/browsing", require("./routes/browsing"));

// Server static assets
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
  );
}

const PORT = 5000;

app.listen(PORT, () =>
  console.log(`Server is up and running over port ${PORT}`)
);
