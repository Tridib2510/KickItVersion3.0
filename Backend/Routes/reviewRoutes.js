 const express=require('express')
 const jwt=require('jsonwebtoken')
 const reviewController=require('../Controller/reviewController')

 const router=express.Router({mergeParams:true})
 
router.route('/createReview').post(reviewController.createReview)



module.exports=router