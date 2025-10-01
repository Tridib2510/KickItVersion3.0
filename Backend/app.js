const express=require('express')
const cors=require('cors')

const app=express()
//This is ver important to allow patch post etch to allow headers along with credentials
app.use(cors({
    origin: (origin, callback) => {
      callback(null, origin)
    },
    credentials: true
  }))

app.options('*', (req, res) => {
    res.header('Access-Control-Allow-Origin', req.headers.origin)
    res.header('Access-Control-Allow-Credentials', 'true')
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')//This is the most important to allow Content-Type and Authorization headers to be included easily
    res.sendStatus(204)
  })

const dotenv=require('dotenv')

const bodyParser=require('body-parser')

app.use(express.json()); 

dotenv.config({path:'config.env'})

const router=require('./Routes/eventRoutes')
const reviewRouter=require('./Routes/reviewRoutes')
const path=require('path')



const AppError=require('./utils/appError')
const errorController = require('./Controller/errorController')
const ErrorController=('./Controller/errorController')
const cookieParser=require('cookie-parser')
const fileUpload=require('express-fileupload')

app.set("view engine","ejs")


app.use(cookieParser())

app.use(bodyParser.urlencoded({extended:false}))

app.use(express.json())
app.use(express.static('../FrontEnd'))

app.use(express.static(path.join(__dirname,'/public/scripts')))

app.use(express.static(path.join(__dirname,'/uploads/')))



app.use('/KickIt',router)
app.use('/KickIt',reviewRouter)




app.use('*',(req,res,next)=>{
    next(new AppError(`Can't find ${req.originalUrl}`,404))
})

app.use(errorController)
module.exports=app