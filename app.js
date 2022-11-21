const mongoose = require("mongoose");
const express = require("express");
// const res = require("express/lib/response");
const app = express();
app.use(express.json());

require('./db/database'); //connection

const userRoute = require('./routers/userRoute');
app.use(userRoute);

app.listen(90)

module.exports = app;