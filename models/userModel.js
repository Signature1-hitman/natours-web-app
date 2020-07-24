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
       
    }
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


const User= mongoose.model('User',userSchema)
module.exports=User