const mongoose = require('mongoose');

const monitoredServiceSchema = new mongoose.Schema({
  name: String,
  url: String,
  owner:String,
    // Add a reference to a category
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
    },
  statusHistory: [
    {
      timestamp:  {type: Date, default: Date.now() },
      statusCode: Number,
      statusMessage: String,
      responseTime:Number,
    }
  ],
  errorRecords: [
    {
      timestamp: { type: Date, default: Date.now() },
      statusCode: Number,
      errorCode:Number,
      errorMessage: String,
    },
  ],
  plannedActivity: [{
    title: String,
   
    startTime: Date,
    
    endTime:Date,
    description: String,
  }],
},
{timestamps:true});

const MonitoredService = mongoose.model('MonitoredService', monitoredServiceSchema);

module.exports = MonitoredService
