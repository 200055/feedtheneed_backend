const mongoose = require("mongoose");
const express = require("express");
const app = express();
var cors = require('cors');

app.use(express.json());
app.use(cors())

require('./db/database'); //connection

const userRoute = require('./routers/userRoute');
const adminRoute = require('./routers/adminRouter');
const blogRoute = require('./routers/blogRouter');
const staffRoute = require('./routers/staffRouter');
const contactRoute= require('./routers/contactRouter');
app.use(userRoute);
app.use(adminRoute);
app.use(staffRoute);
app.use(blogRoute);
app.use(contactRoute);



app.listen(90)

module.exports = app;