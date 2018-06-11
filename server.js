var express= require('express');
var bodyParser=require('body-parser');
var _ = require('lodash');
var app=express();
var mongoose=require('./server/db/mongoose')
var {Todo}=require('./server/models/todo');
var {User}=require('./server/models/user');
const port=process.env.PORT||3000;
app.use(bodyParser.json())



app.post('/todos',(req,res)=>{
   var todo= new Todo({
      text:req.body.text
    })
    todo.save().then((doc)=>{
      res.send(doc)
    },(err)=>{
      res.status(400).send(err)
    })
  });

app.get('/todos',function(req,res){
  Todo.find().then(todo=>{
    res.send({
      todo:todo
    })
  },(err)=>{
    res.status(400).send(err)
  })
})

app.get('/todos/:id',function(req,res){
  const id=req.params.id
  Todo.findById(id).then((todo)=>{
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

 

  app.delete('/todos/:id',(req,res)=>{
     const id=req.params.id

     Todo.findByIdAndRemove(id).then(doc=>{
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
        
    

    Todo.findByIdAndUpdate(id,{$set:body},{new:true}).then(body=>{

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
app.listen(port,()=>{
  console.log(`Starting app at ${port}`)
})