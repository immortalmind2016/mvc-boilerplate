var jwt = require('jsonwebtoken');
const User=require("../../model/user")
const Applicant_profile=require("../../model/Applicant_profile")
const Company_profile=require("../../model/Company_profile")
const {sendEmail}=require("../../services/sendEmail")

var randomstring = require("randomstring");

const signupUser=(req,res,err)=>{
    console.log("SING UYP")
    const {email,password,name,type}=req.body.data
    let newUser=new User({
        email,
        password,
        name,
        type,
        confirmation_token:randomstring.generate(7)

    })
    
    
    newUser.save((err,user)=>{
        if(err){
            return res.sendStatus(500)
        }
        if(!err){
            const to=req.body.data.email
    ,from="Workegypt <dev@workegypt.net>"
    
    ,subject="confirmation"
    text=""
    ,html=`
    <div style="text-align: center;">
    <h3>you are welcome ${user.name}</h3>
    <h4>to confirm you email copy the following code</h4>
    <div style="margin:auto;background: #00326F;color: white;font-weight: bold;width: fit-content;border-radius: 0px;padding: 20px;">
    ${user.confirmation_token}
    </div>
    <br>
    <span>thank you ! </span>
<script>
    
    </script>

</div>

    `
    

    sendEmail({to,subject,text,html,from}).then(()=>{
        //res.sendStatus(200)
    }).catch(error=>{
       // res.json({error})
    });
      
        if(type==0){
            new Applicant_profile({
                    user:user._id
            }).save(err,profile=>{
                
                res.sendStatus(200)
            })
        }
        else if(type==1){
            new Company_profile({
                user:user._id
            }).save(err,profile=>{
                res.sendStatus(200)
            })
        }
        
        }else{
            res.sendStatus(401)
        }
    })
  
}

const signinUser=(req,res,err)=>{
    const  {email,password}=req.body.data;
    console.log(req.body.data)


    User.findOne({email,password},(err,user)=>{
        if(user){
            let user_=user
            let token= jwt.sign({...user_},"secret",{ expiresIn: '365d' })

            if(user.confirmed){
                console.log("EMAIL CONFIRMED")
                    res.json({token:"Bearer "+token,name:user.name,type:user.type})
            }else{

                let confirmation_token=req.body.data.confirmation_token
                if(!req.body.data.confirmation_token){
                    return res.status(401).json({error:"confirm your email",code:"#0"})
                }
                if(confirmation_token==user.confirmation_token){
                    console.log("EMAIL CONFIRMATION_TOKEN  EQUAL INCOMING")
                        
                        user.confirmed=true;
                       
                        res.json({token:"Bearer "+token,name:user.name,type:user.type})
                        user.save()
                    }else{
                        console.log("EMAIL CONFIRMATION_TOKEN  EQUAL INCOMING")

                        res.status(401).json({error:"wrong confirmation code",code:"#1"})
                    }

                }
            }else{
                return res.status(404).json(   {error:"wrong email or password",code:"#2"})

            }
        

      /*  if(user){
         let user_=user
            let token= jwt.sign({...user_},"secret",{ expiresIn: '365d' })
            console.log(token)
            res.json({token:"Bearer "+token,name:user.name,type:user.type})
        }else{
            res.status(404).json({error:"wrong email or password",code:"#2"})
        }*/
     
    })
    
}
const getUser=(req,res,err)=>{
    if(!req.user.type)
    Applicant_profile.findOne({user:req.user._id},(err,profile)=>{
        if(profile){
            return res.json(profile)

        }else{
          return  res.status(404).json({error:"applicant profile not found",code:"#100"})
        }
    }).populate("user")
    else if(req.user.type){
        console.log("COMPANY")
        Company_profile.findOne({user:req.user._id},(err,profile)=>{
            if(profile){
                res.json(profile)
    
            }else{
           
                res.status(404).json({error:"company profile not found",code:"#100"})
            }
        }).populate("user")
    }

}
const editUser=(req,res,err)=>{
 console.log("BODY ",req.body.data)
    User.findOneAndUpdate({_id:req.user._id},{...req.body.data},{new:true},(err,user)=>{
        res.json({user})
    })
   
}



const forgetPassword=(req,res,err)=>{
    User.findOne({email:req.body.data.email},(err,user)=>{
        if(!user){
        return res.json({error:"user not found"})
        }
        console.log("SEND MAIL")
        const to=req.body.data.email
        ,from="Workegypt <dev@workegypt.net>"
        
        ,subject="forget password"
        text=""
        ,html=`
        <div style="text-align: center;">
        <h3>you are welcome</h3>
        <h5>your email is ${req.body.data.email}</h5>
        <h4>your password is :</h4>
        <div style="margin:auto;background: #00326F;color: white;font-weight: bold;width: fit-content;border-radius: 0px;padding: 20px;">
        ${user.password}
        </div>
        <br>
        <span>we recommend  to change your password</span>
    <script>
        
        </script>
    
    </div>
    
        `
        
    
        sendEmail({to,subject,text,html,from}).then(()=>{
            res.sendStatus(200)
        }).catch(error=>{
            res.json({error})
        });
    })
    
}

const resendConfirmation=(req,res,err)=>{
    User.findOne({email:req.body.data.email},(err,user)=>{
        if(!user){
            res.status(404).json({error:"user not found",code:"#100"})

        }
        console.log("SEND MAIL")
        const to=req.body.data.email
        ,from="Workegypt <dev@workegypt.net>"
        
        ,subject="confirmation"
        text=""
        ,html=`
        <div style="text-align: center;">
        <h3>you are welcome ${user.name}</h3>
        <h4>to confirm you email copy the following code</h4>
        <div style="margin:auto;background: #00326F;color: white;font-weight: bold;width: fit-content;border-radius: 0px;padding: 20px;">
        ${user.confirmation_token}
        </div>
        <br>
        <span>thank you ! </span>
    <script>
        
        </script>
    
    </div>
    
        `
        
    
        sendEmail({to,subject,text,html,from}).then(()=>{
            res.sendStatus(200)
        }).catch(error=>{
            console.log("ERROR ",error)
            res.json({error})
        });
    })
}
module.exports={
    signinUser,
    signupUser,
    editUser,
    getUser,
    forgetPassword,
    resendConfirmation
}
