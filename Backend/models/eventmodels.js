const express=require('express')

const user=require('./usermodels')

const mongoose=require('mongoose')

const DB=process.env.DATABASE_LOCAL

const Schema=new mongoose.Schema({
    
    "eventName":{
        type:String,
        required:[true,'Event Name is recquired'],
    },
    "activity":{
        type:String,
        required:[true,'Sports is needed']
    },
    "venue":{
        type:String,
        recquired:[true,'Venue is needed']
    },
    "date":{
        type:Date,
        required:[true,'Date is needed'],
        validate:{
            validator:function(el){
                const eventDate = new Date(el.getTime());

               
                const [hours, minutes] = this.time.split(':').map(Number);
       
                
                eventDate.setHours(hours, minutes, 0, 0);

                return (eventDate)>=Date.now()
              },
              message:'Please input a valid date'
        }
    },
    "time":{

        type:String,
        required:[true,'Time is needed']
    },
    "sports":{
        type:String,
       
    },
    "Description":{
        type:String
       
    },
    
"playersRequired":{
   type:Number,
   required:[true,'No of players is needed'],
   validate:{
    validator:function(el){
        return el>0
      },
      message:'You need at least 1 player'
}
},
"createdBy":{
  type:mongoose.Schema.ObjectId,
    ref:'users'
},
"playersJoined":[{
    type:mongoose.Schema.ObjectId,
    ref:'users'
}],
"joiningRequest":[{
    type:mongoose.Schema.ObjectId,
    ref:'users'
}],
"active":{
    type:String,
    default:'Active'
},
"image":{
    type:String
}


})

Schema.pre('save',async function(next){
     if(this.isModified('playersJoined')){
        if(this.playersJoined.length>=this.playersRequired){
            this.active="Filled"
        }
     }
    
     next()
  })

//   Schema.pre('save',async function(next){
    
//     console.log(this.sports)
//      if(this.activity==='Soccer'){
//            this.image='/assets/Soccer-De2BKXRa.png'
//      }
//      if(this.activity==='Cricket'){
//         this.image='/assets/Cricket-De2BKXRa.png'
//      }
//      if(this.activity==='Badminton'){
//         this.image='/assets/Badminton-De2BKXRa.png'
//      }
//      if(this.activity==='Basketball'){
//         this.image='/src/assets/Basketball.png'
//      }
//      if(this.activity==='Tennis'){
//         this.image='/src/assets/Tennis.png'

//      }
//      next()
//   })


const model=mongoose.model('Events',Schema)

module.exports=model