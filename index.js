require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = 3001; 
const cors = require('cors');
const authRoutes = require('./src/routes/v1/authRoutes'); // Import the user routes module

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.static("public"));
app.use('/uploads',express.static('uploads'))
app.get("/", (req, res) => { 
  console.log("getting in");
  res.end("running");
});
process.env.TZ = 'Asia/Calcutta';

console.log("new working");
app.use('/v1/auth/',authRoutes);
// Start the server
app.listen(port, () => {
  console.log(`running on http://localhost:${port}`);

});

