const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const ejs=require('ejs')
const path=require('path')
const usermodel=require('../models/usermodels')
const catchAsync=require('../utils/catchAsync')
const AppError=require('../utils/appError')
const crypto=require('crypto')
const nodemailer=require('nodemailer')
exports.getLogin=catchAsync(async(req,res,next)=>{
  
    const html=await ejs.renderFile(path.resolve('./public/views/LoginPage.ejs'))
   return res.status(200).send(html)
})

exports.signUp=catchAsync(async(req,res,next)=>{
    console.log('pookies')
    
    console.log(req.body.data)
    const newUser=await usermodel.create(req.body.data)

    const token=jwt.sign({id:newUser._id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRES_IN
    })
   
    res.cookie('token', token, { httpOnly: true,secure:true,sameSite: 'None'});//The option is very very import for cross site cookie transfer
    
   
    res.status(200).json({
        status:"success",
        token,
       id:newUser._id
    })
})

exports.getSignUp=catchAsync(async(req,res,next)=>{
    
    const html=await ejs.renderFile(path.resolve('./public/views/SignUpPage.ejs'))
    return res.status(200).send(html)
})

exports.login=catchAsync(async (req,res,next)=>{
    
    const {email,password}=req.body.data


    if(!email||!password){
        return next(new AppError('Please provide a email or password'),404)
    }
    
    const user=await usermodel.findOne({email:email}).select('+password')//It would be findOne and not find (VVI)

    if(!user||!(await user.correctPassword(password,user.password))){
        return next(new AppError('Incorrect email or password',401))
    }

    const token=jwt.sign({id:user._id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRES_IN
    })

    res.cookie('token', token, { httpOnly: true,secure:true,sameSite: 'None'})

    console.log(token)

   return res.status(200).json({
        status:"success",
        token,
        id:user._id
   })

    
})

exports.protect=catchAsync(async(req,res,next)=>{
    let token
   
    req.headers.authorization=`Bearer ${req.cookies.token}`

 if(req.headers.authorization &&req.headers.authorization.startsWith('Bearer')){
    token=req.headers.authorization.split(' ')[1]
  
 }
 
 if(!token){
    return next(new AppError('You are not logged in',401))
 }
 
 const decode=  jwt.verify(token,process.env.JWT_SECRET)

 const user=await usermodel.findById(decode.id)


 next()
 
})

exports.logOut=catchAsync(async (req,res,next)=>{
    // res.cookie('cookieName', '', {
    //     httpOnly: true, // Ensure the cookie is not accessible via JavaScript
    //     secure: true, // Send only over HTTPS
    //     sameSite: 'None', // Allow cross-origin requests
    //     expires: new Date(0), // Expire the cookie immediately
    //     path: '/', // Ensure the path matches where the cookie was set
    // })
    res.clearCookie('token', { 
        httpOnly: true, 
        secure: true, 
        sameSite: 'None', 
        path: '/', 
    });

  return  res.status(200).json({
        status:"You have logged out"
    })
 })
 exports.forgotPassword=catchAsync(async (req,res,next)=>{
    console.log('Test case 1')
    const user=await usermodel.findOne({email:req.body.email})
    if(!user){
        return next(new AppError('No user found with that email address',404))
    }
    console.log('Test case 2')
  const resetToken=user.createPasswordResetToken()
  console.log('Test case 3')
  await user.save({validateBeforeSave:false})
  console.log('Test case 4')
  console.log(resetToken)

 const transporter=nodemailer.createTransport({
    service:'gmail',
    port: 587,
    secure: false,
    auth:{
        user:'tridibroychowdhury9@gmail.com',
        pass:'fdre gslh jzru rpce'

    }
 })

const mailOptions={
    from :'Tridib Roy Chowdhury <tridibroychowdhury9@gmail.com>',
    to:req.body.email,
    text:`https://kick-its.vercel.app/resetPassword.html?token=${resetToken}`
}

await transporter.sendMail(mailOptions)

  return res.status(200).json({
        status:'success',
        token:resetToken
    })
 })
 exports.resetPassword=catchAsync(async (req,res,next)=>{
    console.log('reset Password')

    const hashedToken=crypto.createHash('sha256').update(req.params.token).digest('hex')
     console.log(hashedToken)
    const user=await usermodel.findOne({passwordResetToken:hashedToken,passwordResetExpires:{$gt:Date.now()}})
   console.log(req.body)
    if(!user){
        return next(new AppError('Token is invalid or has expired',400))
    }
    user.password=req.body.password
    user.confirm_password=req.body.confirm_password
    user.passwordResetToken=undefined
    user.passwordResetExpires=undefined
    
    await user.save()

    const token=jwt.sign({id:user._id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRES_IN
    })
console.log(token)
    res.status(200).json({
        status:"success",
        token
    })
 })