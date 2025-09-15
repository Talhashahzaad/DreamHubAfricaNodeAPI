const dotenv = require('dotenv');

// Load .env variables
dotenv.config();

// Core modules
const express = require('express');
const mongoose = require('mongoose');
const path = require('path')
const cookieParser = require('cookie-parser');

// Custom modules
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const uploads = require('./middleware/upload');

// Import security middleware
const rateLimit = require('express-rate-limit');
const { getCategories } = require('./controllers/categoryController');
const { getLocations } = require('./controllers/locationController');

const listingRoutes = require('./routes/listingRoutes')





const app = express();
app.set('view engine', 'ejs');


// Enable cookie parsing middleware
app.use(cookieParser());

// app.use(express.static('public'));
app.use('/public', express.static(path.join(__dirname, 'public')));
// Enable JSON and URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Apply rate limiter to all incoming requests (global)
// Limits each IP to 100 requests per 15 minutes

// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15m
//   max: 100, 
//   message: "Too many requests from this IP, please try again later",
//   standardHeaders: true, 
//   legacyHeaders: false, 
// });


// trust proxy if behind load balancer
app.set("trust proxy", 1);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: "Too many requests from this IP, please try again later",
});

app.use(limiter); // ✅ this will now work


// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log(" MongoDB connected"))
  .catch(err => console.error(" MongoDB connection error:", err));


// Register route handlers

// Auth related routes
app.use('/', authRoutes);

// User routes
app.use('/user', userRoutes);

// Serve uploaded files statically from the 'uploads' directory
app.use('/uploads', express.static('uploads'));

app.use('/categories', getCategories)

app.use('/locations', getLocations)


// Listing routes

app.use('/', listingRoutes)

//  Email verification 

app.use("/auth", require("./routes/authRoutes"));



// Default route for base URL
app.get('/', (req, res) => res.send('API is running'));


// Cateory routes



// Start the server
app.listen(process.env.PORT, () => {
  console.log(` Server running on port ${process.env.PORT}`);
});
