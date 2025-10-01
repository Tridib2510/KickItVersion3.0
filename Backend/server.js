const express=require('express')


const app=require('./app')

const server=require('./utils/WebSockets')


const mongoose=require('mongoose')

const {Server}=require('socket.io')

const DB=process.env.DATABASE_LOCAL

const model=require('./models/eventmodels')

const ApiFeature=require('./utils/ApiFeature')


process.on('uncaughtException',err=>{
    console.log('UNCAUGHT EXCEPTION')
    console.log(err.name,err.message)
    process.exit(1)
})


mongoose.connect(DB,{
    useNewUrlParser:true,
    useFindAndModify:false
    
   
   
}).then((con)=>{
   
    console.log('Database is connected')
})

server.listen(8000,()=>{
    
    console.log('listening')
})

process.on('unhandledRejection',err=>{
    console.log(err.name,err.message)
    server.close(()=>{
        process.exit(1)
    })
})
