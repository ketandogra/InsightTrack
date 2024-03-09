const mongoose = require('mongoose');

const serviceStatusRecordSchema = new mongoose.Schema({
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MonitoredService',
    },
    responseTime:Number,
    timestamp: { type: Date, default: Date.now },
    statusCode: Number,
    statusMessage: String,
  },{
    timestamps:true
  });


  const ServiceStatusRecord = mongoose.model('ServiceStatusRecord', serviceStatusRecordSchema);
  module.exports = ServiceStatusRecord