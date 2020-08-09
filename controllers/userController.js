const AppError=require('./../utils/appError');
const User = require('../models/userModel');
const filterObj =(obj, ...allowedFields)=>{
  const newObj={}
  Object.keys(obj).forEach(el =>{
    if(allowedFields.includes(el)) newObj[el]=obj[el]
  })
}
exports.getAllUsers = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!'
  });
};
exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!'
  });
};
exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!'
  });
};
exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!'
  });
};
exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!'
  });
};
exports.updateMe =(req,res,next)=>{
  // 1) Creater error if user post password data
  if(req.body.pass|| req.body.passwordConfirm)
  {
      return next(new AppError('This route is not password updates.Please use /updateMy password',400))
  }
  //2) update
  const filteredBody = filterObj(req.body,'name','email')
  const updateUser = await User.findByIdAndUpdate(req.user.id,x, {
    new:true,
    runValidator:true
  })
  res.status(200).json({
    status:'success',
    data:{
      user: updatedUser
    }
  })
}
