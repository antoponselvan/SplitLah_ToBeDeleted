
const express = require("express")
const mongoose = require("mongoose")
const session = require("express-session")
const cors = require("cors")
const path = require("path");

require("dotenv").config()

const app = express()
const MONGO_URI = process.env.MONGO_URI
const PORT = process.env.PORT
const userRouter = require('./routes/userRoutes')
const groupRouter = require('./routes/groupRoutes')
const transactionRouter = require('./routes/transactionRoutes')
const seedDbData = require("./controllers/seedDbController")

mongoose.connect(MONGO_URI)

app.use(express.json())
app.use(cors())
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1*24*3600*1000,
        secure: false
    }
}))
app.use(express.static("../client/dist"));

app.use('/api/users',userRouter)
app.use('/api/groups', groupRouter)
app.use('/api/transactions', transactionRouter)


app.get('/',(req,res)=>{
    res.send("Hello world")
})

app.post('/seedDbData', seedDbData)

// CONNECT TO FRONT END ROUTING
app.get("/*", (req, res) => {
    res.sendFile(path.resolve("../client/dist/index.html"));
  });

mongoose.connection.once("open", ()=>{
    console.log("DB connected")
    app.listen(PORT, ()=>{
        console.log("Server Listening")
    })
})
