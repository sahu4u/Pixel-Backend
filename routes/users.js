const User=require('../models/User');
const router=require('express').Router();
const bcrypt=require('bcrypt');


//update user
router.put("/:id",async(req,res)=>{
    if(req.body.userId===req.params.id||req.user.isAdmin){
        if(req.body.password){
            try{
                const salt=await bcrypt.genSalt(10);
                req.body.password= await bcrypt.hash(req.body.password, salt);
            }
            catch(err){
                return res.status(500).json("ERROR : "+err);
            }
        }
        try{
            const user= await User.findByIdAndUpdate(req.params.id,{$set:req.body})
            res.status(200).json("Account has been updated")
        }
        catch(err){
            return res.status(500).json("ERROR : "+err);
        }

    }
    else{
        return res.status(403).json("You can delete only your account");
    }
})

//delet user
router.delete("/:id",async(req,res)=>{
    if(req.body.userId===req.params.id||req.body.isAdmin){
        try{
            const user= await User.findByIdAndDelete(req.params.id);
            res.status(200).json("Account has been deleted")
        }
        catch(err){
            return res.status(500).json("ERROR : "+err);
        }

    }
    else{
        return res.status(403).json("You can delete only your account");
    }

})
//Get a user

router.get("/:id",async(req,res)=>{
        try{
            const user= await User.findById(req.params.id);
            const {password,updatedAt,...other}=user._doc
             res.status(200).json(user)
            console.log("I AM WORKINGGG")
        }
        catch(err){
            res.status(500).json("ERROR : "+err);
        }

    
})
//follow a user

router.put("/:id/follow",async(req,res)=>{
    if(req.body.userId!==req.params.id){
        try{
            console.log("Follow page!! is workingg")
            
            const user= await User.findById(req.params.id);
            const currentUser= await User.findById(req.body.userId);

            console.log("HMMM"+(user.followers).includes(req.body.userId))
            
            if(!((user.followers).includes(req.body.userId)))
            {
                console.log("Follow page 2!! is workingg")
                await user.updateOne({$push:{followers:req.body.userId}});
                await currentUser.updateOne({$push:{following:req.params.id}});
                res.status(200).json("User has been followed")
            }
            else{
                console.log("Follow page3!! is workingg")
                res.status(403).json("You already follow");
            }
        }
        catch(err){
            console.log("Follow page4!! is workingg")
            res.status(500).json("ERROR : "+err);
        }

    }
    else{
        return res.status(403).json("You can not follow yourself");
    }
    
})

router.put("/:id/unfollow",async(req,res)=>{
    if(req.body.userId!==req.params.id){
        try{
            console.log("Follow page!! is workingg")
            
            const user= await User.findById(req.params.id);
            const currentUser= await User.findById(req.body.userId);

            console.log("HMMM"+(user.followers).includes(req.body.userId))
            
            if(((user.followers).includes(req.body.userId)))
            {
                console.log("Follow page 2!! is workingg")
                await user.updateOne({$pull:{followers:req.body.userId}});
                await currentUser.updateOne({$pull:{following:req.params.id}});
                res.status(200).json("User has been unfollowed")
            }
            else{
                console.log("Follow page3!! is workingg")
                res.status(403).json("You already unfollow");
            }
        }
        catch(err){
            console.log("Follow page4!! is workingg")
            res.status(500).json("ERROR : "+err);
        }

    }
    else{
        return res.status(403).json("You can not unfollow yourself");
    }
    
})






module.exports=router