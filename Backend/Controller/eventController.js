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
const badgeModel=require('../models/badgesmodels')
const chatModel=require('../models/chatmodel')

const ApiFeature=require('../utils/ApiFeature')
const { Mongoose } = require('mongoose')

const {GoogleGenerativeAI}=require('@google/generative-ai')



exports.getAllEvents=catchAsync(async (req,res,next)=>{

   console.log(req.query)

   const options = {
      use_filename: true,
      unique_filename: false,
      overwrite: true,
    };

   
   

  
   let id
   if(req.cookies.token===undefined){
      id='default'
   }
   else{
    const decode=jwt.verify(req.cookies.token,process.env.JWT_SECRET)
     id=decode.id
    }
   
const event=new ApiFeature(eventModel,req.query,req.query,).filter().paginate()

   const data=await event.query   
   let user
    
    if(id==='default'){
      user={
         _id:'default'
      }
    }
    else
    user=await userModel.findById(id)

    const image=user.image
   console.log(image)
      return res.status(200).json({
         token:id,
         data,
         image
      })
   

  
  
})

exports.promoteEvent=catchAsync(async(req,res,next)=>{
  const promoteEvent=await eventModel.find({promote:true})
  
  return res.json({
   promoteEvent
  })


}) 

exports.getPrevChats=catchAsync(async(req,res,next)=>{
   const receiver=req.params.eventId
   const chats=await chatModel.find({receiver:receiver,})
   console.log('chats')
   console.log(chats)
   return res.status(200).json({
      chats,
      sender:chats.sender
   })
})

exports.CreateImage=catchAsync(async(req,res,next)=>{
   const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);
   try {
    const sport=req.params.location
   // const prompt=`Give me an image for ${location} just Give me an url in the form of json from but not from this website upload.wikimedia.org and also remove all the \\n form the url in jpg`
   const prompt=`High resolution  photo of the sport ${sport} just give me the url in form of json.Only give the url and no extra text not from wikipedia` 
   const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const result = await model.generateContent(prompt);
   return res.json({ text: result.response.text() });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Gemini request failed" });
  }
})

exports.getEvent=catchAsync(async(req,res,next)=>{


   const id=req.cookies.token 
   const decode=jwt.verify(id,process.env.JWT_SECRET)
   const user=await userModel.findById(decode.id)
   
   const currentEvent=req.params.eventId

  const event=await eventModel.findById(currentEvent).populate({
   path:'playersJoined'
}) 
console.log(event)
   return res.status(200).json({
      event
   })
})

exports.isActive=catchAsync(async(req,res,next)=>{
  
   const event=await eventModel.find()
   const currentDate=Date.now();
   Object.values(event).forEach(async(event)=>{
      console.log('hey bro')

     const eventDate=new Date(event.date.getTime())

     const [hours,minutes]=event.time.split(':').map(Number)
   
     eventDate.setHours(hours,minutes,0,0)
   
     console.log(eventDate.getTime()+" "+Date.now()+" "+event.eventName+" "+(eventDate.getTime()<Date.now()))

     

      if(eventDate.getTime()<Date.now()){
         const e=await eventModel.findById(event._id)
         await e.save({
            validateBeforeSave: false
         })
      }

      
   })
   
   next()
   
})

exports.getCreateEvent=catchAsync(async(req,res,next)=>{
   
   const decode=jwt.verify(req.cookies.token,process.env.JWT_SECRET)
   
   const id=decode.id

   const user=await userModel.findById(id)
   
   if(!user){
      
      return next(new AppError('Not found by this Id',404))
     }
   const html=await ejs.renderFile(path.resolve('./public/views/CreateEvents.ejs'))
  
   return res.status(200).send(html)
})

exports.createEvent=catchAsync(async(req,res,next)=>{

   const decode=jwt.verify(req.cookies.token,process.env.JWT_SECRET)
   
   const id=decode.id
   console.log(id)
   const user=await userModel.findById(id)
   req.body.createdBy=user._id

   user.eventsCreated=user.eventsCreated+1

   
   await user.save({
      validateBeforeSave: false
   })
 
   if(!user){
      
      return next(new AppError('Not found by this Id',404))
     }
     
//      Object.keys(req.body).forEach((key) => {
//       if (req.body[key]==='') {
//          delete req.body[key];
//      }
//   });

    console.log(req.body)
  
  await eventModel.create(req.body)

  console.log(user)
  
 return res.status(200).json({
   "status":"success"
 })
   
})
let store
exports.eventDetails=catchAsync(async(req,res,next)=>{
  
 
   const id=req.cookies.token
 const a=(req.body.data)._id

  console.log(a)
 // console.log(a._id)
   const decode=jwt.verify(id,process.env.JWT_SECRET)
   //console.log(decode)
   const user=await userModel.findByIdAndUpdate(decode.id,{currentEvent:a})
  
   return res.status(200).json({
    status:"success"
   })
    

})
exports.alreadyJoined=catchAsync(async(req,res,next)=>{
   const id=req.cookies.token
   const decode=jwt.verify(id,process.env.JWT_SECRET)
   const user=await userModel.findById(decode.id)
   const event=await eventModel.findById(req.body.eventId)
   const creator=await userModel.findById(event.createdBy)
 
  
   
   
   if(event.playersJoined.includes(decode.id))
      return res.status(200).json({
        status:"alredyJoined"
      })
   else if(event.joiningRequest.includes(decode.id)){
      return res.status(200).json({
         status:"requestNotYetAnswered"
      })
   }
   else{
      return res.status(200).json({
         status:"notJoined"
      })
   }
   
})

exports.getEventDetails=catchAsync(async(req,res,next)=>{
 
   const id=req.cookies.token
   const decode=jwt.verify(id,process.env.JWT_SECRET)
   const user=await userModel.findById(decode.id)
   console.log('helloo')
   const currentEvent=user.currentEvent

  const event=await eventModel.findById(currentEvent).populate({
   path:'playersJoined'
}) 

   return res.status(200).json({
      user:user,
      userId:decode.id,
      username:user.username,
      event
   })
}


)

exports.join=catchAsync(async(req,res,next)=>{

   const client=req.body.user
   console.log('hello')
  // console.log(client)

   const creatorId=req.body.createdBy
   console.log('Test case 1')
   const eventId=req.body.eventId;

   const id=req.cookies.token
   const decode=jwt.verify(id,process.env.JWT_SECRET)
   console.log('Test Case 4')
    const event=await eventModel.findById(eventId)

    console.log('Test Case 3')

    const user=await userModel.findById(decode.id)

    console.log('Test Case 2')

    const creator=await userModel.findById(creatorId)

 // console.log(event)
  
    console.log('Test Case 0')

   if(req.body.buttonPressed==='accept'){
     
   event.playersJoined.push(client._id)
  
   client.joinedEvents.push(event._id)
   
   }
   console.log('Before')
         
//   console.log(user.requestedEvents)
   //client._id-->joinedRequests-->user
   //eventUser->event->joiningRequest
   // const index=user.joinedRequests.indexOf(client._id)
   // console.log(index)

   //    user.requestedEvents.splice(index,1)

   //    const eventUser=event.joiningRequest.indexOf(client._id)
    

   //    user.joinedRequests.splice(index,1)
   
   //    console.log('After')
         
   //   console.log(user.requestedEvents)
   

   //    event.joiningRequest.splice(eventUser,1)

const eventUser=event.joiningRequest.indexOf(client._id)
 let i=0
 const length=user.joinedRequests.length
 console.log('joinedRequests')
 console.log(user.joinedRequests)
 console.log('requestedEvents')
 console.log(user.requestedEvents)
 console.log(client._id+"------")
 console.log(eventId._id)

       while(i<length && (user.joinedRequests[i]!=client._id || user.requestedEvents[i]!=eventId._id)){
         i++
       }
       console.log('The i is '+i)
       user.requestedEvents.splice(i,1)
       user.joinedRequests.splice(i,1)
       event.joiningRequest.splice(eventUser,1)
        
      console.log(user.joinedRequests)
   
   await user.save({
      validateBeforeSave: false
   })
   await event.save({
      validateBeforeSave: false
   })
   await creator.save({
      validateBeforeSave: false
   })
  

   return res.status(200).json({
      creatorId,
      userId:decode.id
   })
   
})

exports.joinRequest=catchAsync(async(req,res,next)=>{
   
   const creatorId=req.body.createdBy
   
   const eventId=req.body.eventId; 

   const id=req.cookies.token
   const decode=jwt.verify(id,process.env.JWT_SECRET)
   console.log('Test Case 4')
    const event=await eventModel.findById(eventId)

    console.log('Test Case 3')

    const user=await userModel.findById(decode.id)

    console.log('Test Case 2')

    const creator=await userModel.findById(creatorId)

    console.log(creator)
   
    creator.joinedRequests.push(decode.id)

    const userId=decode.id
     
   await userModel.findByIdAndUpdate(
    creator._id,
  { $push: { requests: { userId, eventId } } },
  { new: true, runValidators: true }
);

    console.log('Test Case 0')

   creator.requestedEvents.push(req.body.eventId)

   event.joiningRequest.push(user._id)

   await user.save({
      validateBeforeSave: false
   })
   await event.save({
      validateBeforeSave: false
   })
   await creator.save({
      validateBeforeSave: false
   })
  

   return res.status(200).json({
      creatorId,
      userId:decode.id
   })
   
})

exports.getJoinedEvents=catchAsync(async(req,res,next)=>{
        const id=req.cookies.token
        const decode=jwt.verify(id,process.env.JWT_SECRET)
        const user=await userModel.findById(decode.id)
        console.log('username2')
        console.log(user.username)
        const event=new ApiFeature(eventModel,req.query,req.query).filter().paginate()
        const data=await event.query 

       console.log('Test case getJoinedEvents passed')
      //   event=await data.populate('createdBy')
        return res.status(200).json({
        Event:data,
        user:user.username
    })
})

exports.myEvents=catchAsync(async(req,res,next)=>{

const id=req.cookies.token
const decode=jwt.verify(id,process.env.JWT_SECRET)
const user=await userModel.findById(decode.id)

 const text={playersJoined:decode.id}

 const image=user.image
 
 req.query.playersJoined=decode.id

 console.log(req.query)

const event=new ApiFeature(eventModel,req.query,req.query).filter().paginate()
const data=await event.query 

return res.status(200).json({
  data,
  image



})
})
exports.notification=catchAsync(async (req,res,next)=>{
   const id=req.cookies.token
   console.log(id)
const decode=jwt.verify(id,process.env.JWT_SECRET)
const user=await userModel.findById(decode.id).populate({
   path:'joinedRequests'
}).populate({
   path:'requestedEvents'
})
.populate("requests.userId")   // populate the user
.populate("requests.eventId"); // populate the event

 return res.status(200).json({
   user
 })
})


exports.getPermission=catchAsync(async (req,res,next)=>{
console.log('Test Case passed')
   const id=req.cookies.token
   console.log(id)
const decode=jwt.verify(id,process.env.JWT_SECRET)

const user=await userModel.findById(decode.id).populate({
   path:'eventRequest'
})
const requestedUser=await userModel.findById(user.userRequest).populate('reviews')

console.log('Test Case 2 passed')
 return res.status(200).json({
   token:req.cookies.token,
   user,
   image:user.image,
   event:user.eventRequest,
   requestedUser:requestedUser
 })
})

exports.previewAlreadyShown=catchAsync(async (req,res,next)=>{
    const id=req.cookies.token
const decode=jwt.verify(id,process.env.JWT_SECRET)

const badges=await badgeModel.find({user:decode.id,previewShown:false})

await badgeModel.updateMany(
   {user:decode.id},
   {$set:{previewShown:true}}
)
console.log(badges)
   return res.status(200).json({
      status:"success",
      badges
   })


})



exports.notificationSend=catchAsync(async (req,res,next)=>{
   
   const requestedUser=req.body.requestedUser
   const requestedEvents=req.body.requestedEvents
   
   const id=req.cookies.token
   const decode=jwt.verify(id,process.env.JWT_SECRET)

   const user=await userModel.findById(decode.id)
  
   
   user.userRequest=requestedUser._id
   user.eventRequest=requestedEvents._id

   await user.save({
      validateBeforeSave: false
   })


   return res.status(200).json({
      status:"success"
   })
})

   exports.removeEvent=catchAsync(async (req,res,next)=>{
      console.log(req.cookies.token)
      const eventId=req.body.id
      const event=await eventModel.findById(eventId)
      const token=req.cookies.token
      const decode=jwt.verify(token,process.env.JWT_SECRET)
      console.log('decode'+decode.id)
      if(event.createdBy!=decode.id){
         return next(new AppError('Your do not have permissin to delete a event',401));
      }
      event.active='Inactive'
      await eventModel.findByIdAndDelete(eventId)
      await event.save({
         validateBeforeSave:false
      })
      
      return res.status(200).json({
         status:"successfully removed"
      })
      
   
})

exports.leaveEvent=catchAsync(async(req,res,next)=>{
   console.log('Test Case pookie')
   const id=req.body.id
   const token=req.cookies.token
   const decode=jwt.verify(token,process.env.JWT_SECRET)

   const event=await eventModel.findById(id)
   console.log('Before')
   console.log(event.playersJoined)

   event.playersJoined.pull(decode.id)
   if(event.playersJoined.length==1){
      const newId=event.playersJoined[0]
      event.createdBy=newId
   }
   console.log('After')
   console.log(event.playersJoined)

   await event.save({
      validateBeforeSave:false
   })


   return res.status(200).json({
      status:"success"
   })

})