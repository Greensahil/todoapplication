const {SHA256}=require('crypto-js');
const jwt   =require('jsonwebtoken')
const bcrypt= require('bcryptjs')



var password="mysecretpassword"



bcrypt.genSalt(10,(err,salt)=>{
    bcrypt.hash(password,salt,(err,hash)=>{
        console.log(hash)
    })
})
// var data={
//     id:5
// }

// var token=jwt.sign(data,'dasdas')
// console.log(token)

// var decoded=jwt.verify(token,'dasdas')
// console.log('decoded',decoded);
// var message="I am Sahil Sharma"

// var hash=SHA256(message);

// console.log(`hash: ${hash}`)

// var data={
//     id:4
// }

// var token={
//     data,
//     hash:SHA256(JSON.stringify(data) + 'Some secret').toString()              
// }


// var resultHash=SHA256(JSON.stringify(token.data) + 'Some secret').toString()  

// if(token.hash===resultHash){
//     console.log('Trust this')
// }
// else{
//     console.log('do not trust this')
// }
