
var mongoose = require('mongoose');
var validator = require('validator');
const jwt   =require('jsonwebtoken');
const _ =require('lodash')

var userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    unique: true,
    validate: {
      isAsync: false,
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email'
    }
  },
  password: {
    type: String,
    require: true,
    minlength: 6
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]
});


  
userSchema.methods.toJson=function(){
  var user=this;
  var userObject=user.toObject();
  return _.pick(userObject,['_id','email'])
}
userSchema.methods.generateAuthToken=function(){
  var user=this;
  var access = 'auth';
  var token=jwt.sign({_id:user._id.toHexString(),access},'secretkey').toString();
  user.tokens = user.tokens.concat([{ access, token }])

  return user.save().then(()=>{
    return token
  })

}





  var User=mongoose.model('User',userSchema);
  module.exports={User}
