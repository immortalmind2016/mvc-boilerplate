const Router=require("express").Router()
const {signinUser,getUser,signupUser,editUser,forgetPassword,resendConfirmation}=require("../controller/user/user")
const passport=require("../services/jwtPassport")
/*
url : /api/user/signup
@return ok if success

*/
Router.post("/signup",signupUser)

/*
url : /api/user/signin
@return token

*/
Router.post("/signin",signinUser)

/*
url : /api/user/edit/:id
@return ok

*/
Router.put("/edit",passport.authenticate('jwt', { session: false }),editUser)
Router.get("/",passport.authenticate('jwt', { session: false }),getUser)
/*
expected data shape
{
    data:{
        email:""
    }
}
*/
Router.post("/forget-password",forgetPassword)
/*
expected data shape
{
    data:{
        email:""
    }
}
*/
Router.post("/resend-code",resendConfirmation)

module.exports=Router;