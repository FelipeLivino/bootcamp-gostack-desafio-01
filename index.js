var PORT = process.env.PORT || 3000;
const express = require('express');
const server = express();
server.use(express.json());

const projects = [];
var totalRequest = 0;

server.use((req,res,next)=>{
    totalRequest++;
    console.log('total requests',totalRequest);
    next();
});

function projectExist(req,res,next){
    const {id} = req.params;
    let isValid = false;
    for(let p of projects){
        if(p.id === id){
            isValid = true;
        }
    }
    if(!isValid){
        return res.status(400).json({message: "Project does not exist"})
    }
    return next();
}

//POST
server.post('/projects',(req,resp)=>{
    const {id,title,tasks} = req.body;
    projects.push({id,title,tasks});
    resp.json(projects);
});

server.post('/projects/:id/tasks',projectExist,(req,resp)=>{
    const {id} = req.params;
    const {title} = req.body;
    for(let p of projects){
        if(p.id === id){
            if(!p.tasks)
                p.tasks = [];
            p.tasks.push(title);
        }
    }
    resp.json(projects);
});

//GET
server.get('/projects',(req,resp)=>{
    resp.json(projects);
});
server.get('/projects/:id',projectExist,(req,resp)=>{
    const {id} = req.params;
    let project;
    for(let p of projects){
        if(p.id === id){
            project = p;
            break;
        }
    } 
    resp.json(project);
});

//PUT
server.put('/projects/:id',projectExist,(req,resp)=>{
    const {id} = req.params;
    const {title,tasks} = req.body;
    for(let p of projects){
        if(p.id === id){
            p.title = title;
            p.tasks = tasks;
        }
    }
    resp.json(projects);
});

//delete
server.delete('/projects/:id',projectExist,(req,resp)=>{
    const {id} = req.params;
    projects.forEach((value,index)=>{
        if(value.id == id){
            projects.splice(index,1);
        }
    });
    resp.send();
});

server.listen(PORT);