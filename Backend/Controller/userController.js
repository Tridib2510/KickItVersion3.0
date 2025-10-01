const express=require('express')
const path=require('path')
const EventEmitter=require('node:events')
const ejs=require('ejs')
const eventEmitter = new EventEmitter();
const catchAsync=require('../utils/catchAsync')
const AppError=require('../utils/appError')
const jwt=require('jsonwebtoken')
const mongoose=require('mongoose')
const eventModel=require('../models/eventmodels')
const userModel=require('../models/usermodels')
const ApiFeature=require('../utils/ApiFeature');
const { runInNewContext } = require('node:vm');


const cloudinary=require('cloudinary').v2

cloudinary.config({
    cloud_name:'dsloz7tfz',
    api_key:'872176943676699',
    api_secret:'svjtmkuIsQARXvl8GYV_MqDm65s'
  });
  
exports.getUser=catchAsync(async(req,res,next)=>{
    const decode=jwt.verify(req.cookies.token,process.env.JWT_SECRET)
    const me=await userModel.findById(decode.id)
    console.log(req.body)
    const id=req.params.userId
    const user=await userModel.findById(id).populate('reviews')
    
    return res.status(200).json({
        me:me,
        user
    })
})



exports.getProfile=catchAsync(async(req,res,next)=>{
    const id=req.cookies.token
    console.log(req.body)
   
    const decode=jwt.verify(id,process.env.JWT_SECRET)
    const user=await userModel.findById(decode.id).populate('reviews').populate('badges')
    
   console.log('user')
   console.log(user)
    
    return res.status(200).json({
        user
    })
})
let y;

exports.getUserDetails=catchAsync(async(req,res,next)=>{

   
    const id=req.cookies.token
    const decode=jwt.verify(id,process.env.JWT_SECRET)
    const user=await userModel.findById(decode.id).populate('reviews')

  console.log(user)

    return res.status(200).json({
        user
    })
})

exports.getUpdateProfile=catchAsync(async(req,res,next)=>{
    const id=req.params.id
    const user=await userModel.findById(id)

   
    y=id
    const file=await ejs.renderFile(path.resolve('./public/views/updateProfile.ejs'),{data:user})

    
    
    return res.status(200).send(file)
})





exports.updateProfile=catchAsync(async (req,res,next)=>{

   // console.log(req.body)
//console.log(req.file)
    if(req.file){
    cloudinary.uploader.upload(req.file.path,{
       public_id: req.file.filename,
       resource_type: 'image'
    })
}
console.log('Test case passed')
const id=req.cookies.token
const decode=jwt.verify(id,process.env.JWT_SECRET)
if(req.file){
const imageUrl=cloudinary.url(req.file.filename)
    req.body.image=imageUrl
}

    console.log(req.body)


    const user=await userModel.findByIdAndUpdate(decode.id,req.body)

    return res.status(200).json({
        "status":"success"
    })

 
})

exports.updateProfilePicture=catchAsync(async(req,res,next)=>{

  if(req.file==undefined)return  res.redirect(`http://127.0.0.1:8000/KickIt/profile/${y}`)
   
   
    const newUser=await userModel.findByIdAndUpdate(y,{image:`${req.file.filename}`})

 
    return  res.redirect(`http://127.0.0.1:8000/KickIt/profile/${y}`)
    

})

exports.makeChanges=catchAsync(async(req,res,next)=>{
   req.id=y
   
    next()
})
exports.getUsers=catchAsync(async(req,res,next)=>{
    
    const id=req.params.id
    const mongooseId=mongoose.Types.ObjectId(id)
    console.log(mongooseId)
  
    const joinedEvents={
        joinedEvents:id
    }
    const user=await userModel.find()
console.log(user)
    res.status(200).json({
        user:user
    })
})

exports.changeMode=catchAsync(async(req,res,next)=>{
    const decode=jwt.verify(req.cookies.token,process.env.JWT_SECRET)
    console.log(decode)
  const user=await userModel.findById(decode.id)
  console.log(user)
    const mode=user.mode
    if(user.mode==='light'){
        user.mode='dark'
    }
    else{
        user.mode='light'
    }

    await user.save({
      validateBeforeSave: false
   })

    
    res.status(200).json({
        status:'success',
        user
    })
})