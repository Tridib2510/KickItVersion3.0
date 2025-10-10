const express=require('express')
const jwt=require('jsonwebtoken')
const router=express.Router()

const multer=require('multer')

const storage=multer.diskStorage({
    destination:function(req,file,cb){
       // console.log(req.body)
        //onsole.log(file)
       

        return cb(null,'./uploads')
    },
    filename:function(req,file,cb){
       const id=req.cookies.token
       const decode=jwt.verify(id,process.env.JWT_SECRET)
        return cb(null,`${Date.now()}_${decode.id}`)
    }
})

const upload=multer({storage:storage})

const eventController=require('../Controller/eventController')

const userController=require('../Controller/userController')

const authController=require('../Controller/authController')

const reviewController=require('../Controller/reviewController')

const reviewRouter=require('./reviewRoutes')

//router.route('/createEvent/:id').get(eventController.getCreateEvent).post(eventController.createEvent)

router.route('/createEvent').get(eventController.getCreateEvent).post(eventController.createEvent)

router.route('/getPrevChats/:eventId').get(eventController.getPrevChats)

router.route('/home').get(eventController.isActive,eventController.getAllEvents)

router.route('/getEvent/:eventId').get(eventController.getEvent)

router.route('/generateImage/:location').get(eventController.CreateImage)

router.route('/profile').get(authController.protect,userController.getProfile)

router.route('/profileUpdate').get(authController.protect,userController.getUpdateProfile).patch(upload.single('file'),userController.updateProfile).post(userController.makeChanges,upload.single("image"),userController.updateProfilePicture)

router.route('/signUp').post(authController.signUp)

router.route('/changeMode').get(userController.changeMode)

router.route('/login').post(authController.login)

router.route('/previewAlreadyShown').get(eventController.previewAlreadyShown)

router.route('/logout').get(authController.logOut)

router.route('/getEventDetails').patch(eventController.eventDetails).get(eventController.getEventDetails)

router.route('/getUser').get(userController.getUserDetails)

router.route('/joinEvent').patch(eventController.join)

router.route('/removeEvent').patch(eventController.removeEvent)

router.route("/leaveEvent").patch(eventController.leaveEvent)

router.route('/joinRequestToCreator').patch(eventController.joinRequest)

router.route('/alreadyExits').patch(eventController.alreadyJoined)

router.route("/isLoggedIn").get(authController.isLoggedIn)

router.route('/joinedEvents').get(eventController.getJoinedEvents)

router.route('/myEvents').get(authController.protect,eventController.myEvents)

router.route('/PermissionNeeded').get(eventController.getPermission)

router.route('/joinRequests').get(eventController.notification).patch(eventController.notificationSend)

router.route('/:userId').get(userController.getUser)

router.route('/forgotPassword').post(authController.forgotPassword)
router.route('/removeEvent').delete(eventController.removeEvent)

router.route('/resetPassword/:token').patch(authController.resetPassword)


router.use('/:userId/Review',reviewRouter)


module.exports=router