const Review = require('./../models/reviewModel')
const catchAsync = require('./../utils/catchAsync')
const factory = require('./handlerFactory')

exports.getAllReviews=catchAsync(async (req,res,next)=>{
let filter ={}
    if(req.params.tour.Id) filter ={tour:req.params.toursId}
    const reviews = await Review.find()
    res.status(200).json({
        status:'success',
        results: reviews.length,
        data:{
            reviews
        }
    })
})

exports.setTourUserIds= (req,res,next)=>{

    if(!req.body.tour) {
        req.body.tour=req.params.tourId
    }
    if(!req.body.user)
    {
        req.body.user = req.user.id

    }
    next();
    
}; 
exports.getReview=factory.getOne(Review);
exports.createReview = factory.createOne(Review)
exports.updateReview = factory.updateOne(Review)
exports.deleteReview = factory.deleteOne(Review)