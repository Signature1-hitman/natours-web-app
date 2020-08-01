const mongoose=require('mongoose')
const validator=require('validator')
const bcrypt=require('bcryptjs')
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
    passwordChangedAt:Date

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


const User= mongoose.model('User',userSchema)
module.exports=User