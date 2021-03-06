
var mongoose = require('mongoose');
var validator = require('validator');
const jwt   =require('jsonwebtoken');
const _ =require('lodash')
const bcrypt= require('bcryptjs')

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

userSchema.methods.toJSON = function () {
  var user = this;
  var userObject = user.toObject();

  return _.pick(userObject, ['_id', 'email']);
}
  

userSchema.methods.generateAuthToken=function(){
  var user=this;
  var access = 'auth';
  var token=jwt.sign({_id:user._id.toHexString(),access},'secret').toString();
  user.tokens = user.tokens.concat([{ access, token }])

  return user.save().then(()=>{
    return token
  })
  
}
userSchema.methods.removeToken=function(token){
  var user=this;
  return user.update({
    $pull:{
      tokens:{
        token:token
      }
    }
  });
}




userSchema.statics.findByToken=function(token){
  var User=this;
  var decoded;
  try{
    decoded=jwt.verify(token,'secret');
  }
  catch(e){
          // new Promise((resolve,reject)=>{
          //   reject()
          // })
          return Promise.reject();
  }

  return User.findOne({
        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
  })

}

userSchema.statics.findByCredentials = function (email, password) {
  var User = this;

  return User.findOne({email}).then((user) => {
    if (!user) {
      return Promise.reject();
    }

    return new Promise((resolve, reject) => {
      // Use bcrypt.compare to compare password and user.password
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          resolve(user);
        } else {
          reject();
        }
      });
    });
  });
};

userSchema.pre('save',function(next){
  var user=this;
  if (user.isModified('password')){
    bcrypt.genSalt(10,(err,salt)=>{
      bcrypt.hash(user.password,salt,(err,hash)=>{
        user.password=hash
        next()
      })
    })
  }else{
    next()
  }
})

  var User=mongoose.model('User',userSchema);
  module.exports={User}
