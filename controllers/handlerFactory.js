const catchAsync = require("../utils/catchAsync");
const { Model } = require("mongoose");
const AppError = require("../utils/appError");
const Tour = require("../models/tourModel");

exports.deleteOne = Model => catchAsync(async(req,res,next) => {
    const doc = await Model.findByIdAndDelete(req.params.id)

if(!doc)
{
return next(new AppError('No document found with that ID',404))
}
res.status(204).json({
    status:'success',
    data:null
})

})
exports.updateOne =Model=> catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
  
    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }
  
    res.status(200).json({
      status: 'success',
      data: {
     doc
      }
    });
  });

exports.getOne =(Model,popOptions) =>catchAsync(async (req, res, next) => {
let query = Model.findById(req.params.id)
if(popOptions) query = query.populate(popOptions)
  // Tour.findOne({ _id: req.params.id })
const doc = await query
  if (!doc) {
    return next(new AppError('No document found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
    data:{
      data:doc
    }
    }
  });
});
exports.getAll = Model => catchAsync(async (req,res,next)=>{


  let filter ={}
  if(req,params.tourID) filter = {tour:req.params.tourId}
const features = new APIFeatures(Model.find(filter),req.query)


})
exports.createOne=Model => catchAsync(async(req,res,next)=>{
  const doc= await Model.create(req.body);
  res.status(201).json(
    {
      status:'success',
      data:{
        data:doc
      }
    }
  )
})
