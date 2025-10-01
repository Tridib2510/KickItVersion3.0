const express=require('express')

const user=require('./usermodels')

const mongoose=require('mongoose')

const DB=process.env.DATABASE_LOCAL

const Schema=new mongoose.Schema({
    
    "User":{
        type:mongoose.Schema.ObjectId,
        ref:'users'
    },
    "createdAt":{
     type:Date,
     default:Date.now()
    },
    "rating":{
        type:String
    },
    "review":{
        type:String
    },
    "date":{
        type:Date
    },
    "eventName":{
        type:String
    },
    "sports":{
        type:String
    },
"playersRequired":{
   type:Number
},
"createdBy":{
  type:mongoose.Schema.ObjectId,
    ref:'users'
},
"reviewer_image":{
  type:String
},
"reviewer":{
    type:String
}

},
{
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
})

Schema.pre(/^find/,function(next){
  this.populate({
    path:'User'
  }).populate({
    path: 'createdBy'
  });
    next()
})



const model=mongoose.model('Review',Schema)

module.exports=model