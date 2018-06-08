var express= require('express');
var bodyParser=require('body-parser');

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

app.listen(port,()=>{
  console.log(`Starting app at ${port}`)
})