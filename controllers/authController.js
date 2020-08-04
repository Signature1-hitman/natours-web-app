const User=require('./../models/userModel')
const jwt=require('jsonwebtoken') 
const AppError=require('./../utils/appError')
const {promisify}=require('util')
const sendEmail = require('../utils/email')
const crypto = require('crypto')
const signToken=id=>{
    return  jwt.sign({id:id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRES_IN})
}

exports.signup=async(req,res,next)=>
{
    const newUser=await User.create({
        name:req.body.name,
        email:req.body.email,
        password:req.body.password,
        passwordConfirm:req.body.passwordConfirm,
        role:req.body.role
    })
const token= signToken(newUser._id)

    res.status(201).json({
        status:'success',
        token,
        data:{
            user:newUser
        }
    })
} 
exports.login=async (req,res,next)=>{

    const {email,password}=req.body
    if(!email||!password)
    {
        next(new AppError('Please provide email and password!',400))
       

    }
    const user=await User.findOne({email}).select('+password')

    console.log(user)
    if(!user||!(await user.correctPassword(password,user.password)))
    {
        return next(new  AppError('Incorrect email or password'),401)
    }

    const token=signToken(user._id)
    res.status(200).json({
        status:'success',
        token
    })
} 
exports.protect = async(req,res,next)=>{
    //1) Getting token and check of its there
    let token
    if (req.headers.authorization&& req.headers.authorization.startsWith('Bearer'))
    {
        token =req.headers.authorization.split(' ')[1] 
    }
    console.log(token)
    if(!token){
        return next(new AppError("You are not logged in",401))
    }
    //2) Verification token
    const decoded=await promisify(jwt.verify)(token,process.env.JWT_SECRET)
   console.log(decoded)
   const freshUser= await User.findById(decoded.id)

    //3) Check if user still exists
    if(!freshUser)
    {
        return next (new AppError('The user beelonging to this token does not exist.',401))
    }
    //4) check if user changed password after the token was issued
if(freshUser.changedPasswordAfter(decoded.iat)){
    return next(new AppError('User recently changed password:please log in again',401))
}

//clear being
token=await promisify(jwt.verify)(token,process.env.JWT_SECRET)
req.user=freshUser
    next();
    console.log("This is changed")
}
exports.restricTo=(...roles)=>{

    return(req,res,next)=>{
if(!roles.includes(req.user.role))
{
    return next( new AppError('You do not have permission to perform this action',403))
}
 

next();

    }
}
exports.forgotPassword=async (req,res,next)=>{

    const user = await User.findOne({email:req.body.email})
    if(!user)
    {
        return next (new AppError('There is no user with email address',404))
    }
    const resetToken = user.createPasswordResetToken();
await user.save({validateBeforSave:false})
const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`
const message = 'Forgot your password? Submit a Patch request with your password and password confirm' +`${resetURL}.\nIf you didn't`
try{
    await sendEmail({
        email:user.email,
        subject:'Your password reset token for 10 min',
        message
    })
    res.status(200).json({
        status:'success',
        message:'Token sent to mail'
    })
}
catch(err){
    user.passwordResetToken=undefined;
    user.passwordResetExpires=undefined;
    await user.save({validateBeforeSave:false})
    return next(
        new AppError('there was an error sending email please try again later',500)
    )
}

}
exports.resetPassword=(req,res,next)=>{

    //1) Get user based on the token
    //2) if token has not expired and there is user,set the new password
    //3) Update changedPassword property for the user
    //4) log the user in ,send jwt 
}