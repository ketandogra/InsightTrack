const mongoose = require('mongoose');
const categorySchema = new mongoose.Schema({
    name: String,

    // Add a field to hold an array of services
    services: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MonitoredService',
      },
    ],
  });
  
  const Category = mongoose.model('Category', categorySchema);
  
  module.exports = Category;