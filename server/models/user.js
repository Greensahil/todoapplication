
var mongoose = require('mongoose');

userSchema=new mongoose.Schema({
    email:{
      type:String,
      required:true,
      trim:true,
      minlength:1
  }})
  
  User=mongoose.model('User',userSchema);
  module.exports={User}
//   var newUser=new User({
//     email:"ssharma2@svsu.edu"
//   })
//   newUser.save().then((doc)=>{
//     console.log('A new user has been created',doc)
//   },(err)=>{
//       console.log('Unable to save the new user')
//   }
//   )