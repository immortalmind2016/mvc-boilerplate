const mongoose = require('mongoose')
mongoose.connect("mongodb://immortalmind:0115120323a@ds036967.mlab.com:36967/test1", { useUnifiedTopology: true, useNewUrlParser: true })
const express = require("express");
const bodyParser = require("body-parser")
const app = express()
app.use(express.static("public"))
const path = require("path")
const passport = require("./services/jwtPassport")
require('dotenv').config()

const user = require("./routes/user")
const profile = require("./routes/profile")
const job = require("./routes/job")
const company = require("./routes/company")
const payment = require("./routes/payment")
const applicant = require("./routes/applicant")
const admin = require("./routes/admin")

app.use(passport.initialize())
app.use(passport.session())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));


app.use(function (req, res, next) {
     var allowedOrigins = ["http://ae435531.ngrok.io",'http://localhost:5000',"http://4a011676.ngrok.io/", "http://93f52e7f.ngrok.io", 'http://5d845a7f.ngrok.io', "http://490ea9cb.ngrok.io", 'http://127.0.0.1:3000',"http://localhost:3001", "http://localhost:3000", "http://5945f4bd.ngrok.io", "http://42249189.ngrok.io"];
     var origin = req.headers.origin;
     if (allowedOrigins.indexOf(origin) > -1) {
          //res.setHeader('Access-Control-Allow-Origin', origin);
          res.header("Access-Control-Allow-Origin", "*");

     }
     //      res.setHeader("Access-Control-Allow-Origin", "*");
     //res.setHeader("Access-Control-Allow-Origin", "");

     res.setHeader("Access-Control-Allow-Methods", "POST, GET,DELETE,PUT,OPTIONS");
     res.setHeader("Access-Control-Max-Age", "3600");
     res.setHeader("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

     next();
});
app.use("/privacy", (req, res, err) => {
     res.download("./Policies.pdf")
})
app.use("/api/user/", user)

app.use("/api/profile/", profile)

app.use("/api/job/", job)

app.use("/api/company/", company)
app.use("/api/applicant/", applicant)

app.use("/api/payment/", payment)
app.use("/api/admin/", admin)


const PORT = 5000
app.listen(PORT, () => {
     console.log(`listining on port number ${PORT}`)
})