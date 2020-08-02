const mongoose=require('mongoose')
const validator=require('validator')
const bcrypt=require('bcryptjs')
const crypto = require('crypto')
const userSchema=new mongoose.Schema(
    {
    name:{
        type:String,
        required:[true,'Please tell us your name']
    },
    email:{
type:String,
required:[true,'Please provide your email'],
unique:true,
lowercase:true,
validate:[validator.isEmail,'Please provide a valid email']

    },
    photo:{
type:String
    },
    role:{
      type:String,
      enum:[
          'user','guide','lead-guide','admin'
      ],
      default:'user'   
    }
    ,
    password:{
        type:String,
        required:[true,'A user should have password'],
        minlength:8,
        select:false
    },
    passwordConfirm:{
        type:String,
        required:[true,'Confirm password'],
        validate:{
            //This only works on create or save
            validator:function(el)
            {
                return el===this.password
            },
            message:'Password are not th same'

        }
       
    },
    passwordChangedAt:Date,
    passwordResetToken:String,
    passwordResetExpires:Date

})
userSchema.pre('save',async function(next){
    if(!this.isModified('password')) 
    {
        return next()
    }
    this.password=await bcrypt.hash(this.password,14);
    this.passwordConfirm=undefined
    next()

})


userSchema.methods.correctPassword= async function(candidatePassword,userPassword){
    return await bcrypt.compare(candidatePassword,userPassword)
}
userSchema.methods.changedPasswordAfter= function(JWTimestamp){

    if(this.passwordChangedAt)
    {
        var changedTimestamp=parseInt(this.passwordChangedAt.getTime()/1000,10)
        console.log(this.passwordChangedAt,JWTimestamp)
    }
    return JWTimestamp<changedTimestamp;
}
userSchema.methods.createPasswordResetToken= function(){
const resetToken= crypto.randomBytes(32).toString('hex')
this.passwordReset=Tokencrypto.createHash('sha256').update(resetToken).digest('hex')

this.passwordResetExpires=Date.now()+10*68*1000;
return resetToken
}

const User= mongoose.model('User',userSchema)
module.exports=User