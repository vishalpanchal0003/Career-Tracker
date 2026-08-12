const express = require('express');
const mongoose = require("mongoose");
const cors = require('cors');
const dbConfigretion = require('./db/dbconfig.js');
const jobRoutes = require('./routes/jobRoutes.js');
const authRoutes = require('./routes/authRoutes.js');
const dotenv = require('dotenv').config()

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
dbConfigretion();
const corsOptions = {
  origin: '*',
  // credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));
app.use(express.json());
app.use('/api/jobs', jobRoutes);
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 
