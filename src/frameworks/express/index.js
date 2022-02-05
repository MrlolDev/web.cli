const express = require("express");
const app = express();
const morgan = require("morgan");
require("dotenv").config();

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("PORT", process.env.PORT || 3000);
app.use("/", require("./routes/routes"));

app.listen(app.get("PORT"), () => {
    console.log(`Server running on port ${app.get("PORT")}`);
});