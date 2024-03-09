const express = require('express')

const {createNewService,updatePlannedActivity,getAllServices,getAllCategories,getService,editService} = require('../controllers/serviceCtrl')

const router = express.Router()

//Create new Service
router.post('/create',createNewService)

//Set Planned activity
router.put('/planned-activity/:id',updatePlannedActivity)

//Edit Existing Service
router.put('/update-service/:id',editService)

//Get All services
router.get('/all',getAllServices)

//Get All Categories
router.get('/categories',getAllCategories)

//Get service
router.get('/:id',getService)

module.exports = router