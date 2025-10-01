const express=require('express')

const user=require('./usermodels')

const mongoose=require('mongoose')

const DB=process.env.DATABASE_LOCAL

const Schema=new mongoose.Schema({
   
    "badgeName":{
        type:String
    },
    "user":{
     type:mongoose.Schema.ObjectId,
     ref:'users'
    },
    "description":{
        type:String
    },
    "issuedOn":{
        type:Date
    },
    "previewShown":{
        type:Boolean
    },
    "image":{
        type:String
    }


})



const model=mongoose.model('Badges',Schema)

module.exports=model