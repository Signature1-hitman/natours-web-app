const User=require('./../models/userModel')
const jwt=require('jsonwebtoken') 
const AppError=require('./../utils/appError')
const {promisify}=require('util')
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
        passwordConfirm:req.body.passwordConfirm
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
    if (req.headers.authorization&& req.headers.authorization.startwith('Bearer'))
    {
        token =req.headers.authorization.split(' ')[1] 
    }
    console.log(token)
    if(!token){
        return next(new AppError("You are not logged in",401))
    }
    //2) Verification token
    const decoded=await promisify(jwt.verify)(token.process.env.JWT_SECRET)
   console.log(decoded)
    //3) Check if user still exists
  
    //4) check if user changed password after the token was issued


//clear being
    next();
}