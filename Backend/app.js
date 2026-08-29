const express = require('express');
const cors = require('cors');
const { MongoDB_URI } = require('./config/configure');
const Advertiesetment = require('./Model/Advertiesetment');
const AdvertiestmentRoute = require('./Routes/AdvertiestmentRoute')
const dotenv = require('dotenv');
const connectDB = require('./Config/configure');
// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB Atlas
connectDB();

const app = express();

app.use(cors());
app.use(express.urlencoded({extended:true}));    

app.use('/api/advertisement', AdvertiestmentRoute);

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


module.exports = app;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'FarmNet API is live' });
});
// Mount the auth routes
app.use('/api/auth', require('./Routes/authRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
