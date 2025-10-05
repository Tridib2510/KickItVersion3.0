const {Server}=require('socket.io')

const app=require('../app')

const http=require('http')

const eventModel=require('../models/eventmodels')
const userModel=require('../models/usermodels')
const chatModel=require('../models/chatmodel')
const server=http.createServer(app)


  const io=new Server(server,{cors:{
    credentials:true
  }}) 
let a=0
io.on('connection',async socket=>{   
 console.log('connection is successfull')
    socket.on('joinRoom', (room) => {
      
       socket.join(room);  
        console.log(`User joined room: ${room}`);
      });
    //   const rooms =(io.sockets.adapter.rooms.get('pookie'));
    //   console.log(rooms)
    socket.on('sendRequest',async(creatorId,str,userId,event)=>{
        console.log('userId'+userId)
        const user=await userModel.findById(userId)
         console.log('The user is') 
         io.to(creatorId).emit('send', user,event);
    })

     socket.on('message',async(x,name,eventId,userId)=>{
        console.log('The user is '+userId)
        console.log(name)
        console.log(x[x.length-1].text)
        console.log(eventId)

      const chat=await chatModel.create({
        sender:userId,
        senderName:name,
        receiver:eventId,
        message:x[x.length-1].text,

      })

        socket.to(eventId).emit("send",x[x.length-1].text,name,eventId);
    })
    
    
   

})



module.exports=server

