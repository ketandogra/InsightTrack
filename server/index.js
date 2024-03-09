const express = require('express');
require('dotenv').config()
const cors = require('cors');
const bodyParser = require('body-parser')
const app = express();
const db = require('./config/mongoose')
const serviceRoute = require('./routes/serviceRoute')
const {monitorServices} = require('./controllers/serviceCtrl')

// Use the cors middleware 
app.use(cors({
  origin: 'http://localhost:3000', // allowed origin (React app's domain)
  methods: 'GET,PUT,PATCH,POST,DELETE', // allowed HTTP methods
  allowedHeaders: 'Content-Type,Authorization', //allowed headers
}));

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())



app.use('/api/service',serviceRoute)


const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Schedule the monitoring task to run every 5 minutes
setInterval(monitorServices, 60 * 60 * 1000);
