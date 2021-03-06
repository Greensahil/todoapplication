var express= require('express');
var bodyParser=require('body-parser');
var _ = require('lodash');
var app=express();
var mongoose=require('./server/db/mongoose')
var {Todo}=require('./server/models/todo');
var {User}=require('./server/models/user');
var {authenticate}=require('./server/middleware/authenticate')
const port=process.env.PORT||3000;
app.use(bodyParser.json())



app.post('/todos',authenticate,(req,res)=>{
   var todo= new Todo({
      text:req.body.text,
      _creator:req.user._id
    })
    todo.save().then((doc)=>{
      res.send(doc)
    },(err)=>{
      res.status(400).send(err)
    })
  });

app.get('/todos',authenticate,function(req,res){
  Todo.find({
    _creator:req.user._id
  }).then(todo=>{
    res.send({
      todo:todo
    })
  },(err)=>{
    res.status(400).send(err)
  })
})

app.get('/todos/:id',authenticate,function(req,res){
  const id=req.params.id
  
  Todo.findOne(
    {_id:id,
      _creator:req.user._id
  }).then((todo)=>{
    if(!todo){
      console.log('Id was not found')
    }
    else{
      res.status(404).send({todo:todo})
    }

  }).catch(err=>{
    res.status(400).send()
  })
}
  )

 

  app.delete('/todos/:id',authenticate,(req,res)=>{
     const id=req.params.id
     Todo.findOneAndRemove(
       {id:_id,
         _creator:req.user._id })
      .then(doc=>{
     if(!doc){
       res.status(404).send()
     }   
      res.status(200).send(doc)


     }).catch(err=>{
       res.status(400).send()
     })


  })

  app.patch('/todos/:id',(req,res)=>{

    var id=req.params.id;

    var body=_.pick(req.body,['text','completed']);

    if (_.isBoolean(body.completed) && body.completed){
        body.completedAt=new Date().getTime();
    }
    else{
      body.completedAt=null;
      body.completed=false;
    }
        
    

    Todo.findOneAndUpdate({
        _id:id,
        _creator:req.user._id
        },{$set:body},{new:true}).then(body=>{

      if(!body){
        res.status(400).send()
      }
      else{
        res.status(200).send(body)
      }

    }).catch(err=>{
      res.status(400).send(err);
    })



  })


// POST /users
app.post('/users', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);
  var user = new User(body);

  user.save().then(() => {
    return user.generateAuthToken();
  }).then((token) => {
    res.header('x-auth', token).send(user);
  }).catch((e) => {
    res.status(400).send(e);
  })
});

//Login route
app.post('/users/login', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);

  User.findByCredentials(body.email, body.password).then((user) => {
    return user.generateAuthToken().then((token) => {
      res.header('x-auth', token).send(user);
    });
  }).catch((e) => {
    res.status(400).send();
  });
});

app.get('/users/me',authenticate,(req,res)=>{
 res.send(req.user);
})

app.delete('/users/me/token',authenticate,(req,res)=>{
  req.user.removeToken(req.token).then(()=>{
      res.status(200).send()
    
  },()=>{
    res.status(400).send()
  })
})
app.listen(port,()=>{
  console.log(`Starting app at ${port}`)
})
