const mongoose=require("mongoose")
const Schema=mongoose.Schema
const User=new Schema({
    name:{
        type:String,
        required:true
    },
    confirmation_token:{
            type:String
     
    },
    
    confirmed:{
        type:Boolean,
        default:false,
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },      
    created_date:{
        type:Date,
        default:Date.now()
    },
   
    last_logout:{
        type:Date,
        default:null
    },
    type:Boolean,
    new:{
        type:Boolean,
        default:true
    },
    payment:{
        type:Object
    }
    

    
   



})


module.exports=mongoose.model("User",User)