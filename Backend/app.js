console.log("Hello World");
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { MongoDB_URI } = require('./config/configure');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

app.use("/",(req,res)=>{
    res.send("Database is connected and server is running");
})

// Connect to MongoDB
mongoose.connect(MongoDB_URI)
.then(()=>{console.log("connected to database")})
.then(()=>{
    app.listen(5000);
    })
.catch((err)=>{console.log(err)});