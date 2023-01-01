const mongoose = require("mongoose");
const express = require("express");
const app = express();
var cors = require('cors');
const session = require('express-session');
app.use(express.json());
app.use(express.static(__dirname + '/photos'));

app.use(cors())

require('./db/database'); //connection

app.use(session({
    secret: 'feedthe@!@!#!1121Need@@!@!##!#',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}));

const userRoute = require('./routers/userRoute');
const adminRoute = require('./routers/adminRouter');
const blogRoute = require('./routers/blogRouter');
const staffRoute = require('./routers/staffRouter');
const helpAndSupportRouter= require('./routers/helpAndSupportRouter');
const partnerRouter = require('./routers/partnerRouter');
const transactionRouter = require('./routers/transactionRouter');
app.use(userRoute);
app.use(adminRoute);
app.use(staffRoute);
app.use(blogRoute);
app.use(helpAndSupportRouter);
app.use(partnerRouter);
app.use(transactionRouter);

app.listen(90)

module.exports = app;