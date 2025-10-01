const express=require('express')
const path=require('path')
const EventEmitter=require('node:events')
const ejs=require('ejs')
const jwt=require('jsonwebtoken')
const eventEmitter = new EventEmitter();
const catchAsync=require('../utils/catchAsync')
const AppError=require('../utils/appError')

const userModel=require('../models/usermodels')
const eventModel=require('../models/eventmodels')
const reviewModel=require('../models/reviewModel')

const ApiFeature=require('../utils/ApiFeature')


 

exports.createReview=catchAsync(async(req,res,next)=>{
    console.log("Test case passed and review created")
    console.log(req.body.reviewData) 
    const eventId=req.body.reviewData.event
    

   const event=await eventModel.findById(eventId)
   
   console.log("Reviewed Event")
   console.log(eventId)
   console.log(event)

    console.log(req.body.reviewData)
    const id=req.cookies.token
    console.log(id)
    const decode=jwt.verify(id,process.env.JWT_SECRET)

    if(event.createdBy!=decode.id){
       return next(new AppError('Your are not the creator of this event',401))
    }

    const user=await userModel.findById(decode.id)

    const client=await userModel.findById(req.body.reviewData.User)

    client.ratings.push(req.body.reviewData.rating)
    client.ratingsDate.push(Date.now())

    await client.save({
        validateBeforeSave: false
     })  

   
    
if(!req.body.reviewData.createdBy)req.body.reviewData.createdBy=user._id
req.body.reviewData.reviewer=user.username
req.body.reviewData.reviewer_image=user.image
const newReview=await reviewModel.create(req.body.reviewData)
return res.status(200).json({
    newReview
})


})