var pgp = require('pg-promise')(/*options*/);
var express = require('express');
var app = express();
var cors = require('cors')
app.use(cors())

//app.configure, app.use etc



var cn = {
    host: 'localhost', // server name or IP address;
    port: 5432,
    database: 'email_app_database',
    user: 'postgres',
    password: 'postgres',
    poolSize: 10
};


var db = pgp(cn);

function insertItem(itemId, itemName)
{
	var json ={};
	db.none('INSERT INTO Users(email, password) VALUES(${id}, ${item});', {
    id: itemId,
    item: itemName}).then(function (result) {
        console.log(result); // print user result;
	json=result;
    })
    .catch(function (error) {
        console.log(error); // print why failed;
    });
return json;
}

//app.get('/getItems', (req, res) => res.send(allItems))
app.get('/getUsers',function(req,res){
	db.query("select * from Users;")
	.then(function (result) {
	res.send(result);
	console.log("Inside func",result); // print user result;
   	 })
	    .catch(function (error) {
        console.log(error); // print why failed;
	res.send(error);
    	});
})

app.get('/sign_up/:name/:password',function(req,res){

	db.one('INSERT INTO Users(email, password) VALUES(${id}, ${item});', {
    id: req.params.name,
    item: req.params.password}).then(function (result) {
        console.log("insert func",result); // print user result;
	res.send("Registered successfully");
    })
    .catch(function (error) {
        console.log(error); // print why failed;
	res.send(error);
    });
	
})

app.get('/sign_in/:name/:password',function(req,res){
	db.one('select email,password from Users where email = ${email} and password = ${password};',{
	email:req.params.name,
	password:req.params.password}).then(function(result){
	res.send(result);}).catch(function(error){
	res.send(error);
	});
})

app.get('/inbox/:email',function(req,res){
    db.any('select * from Email where receiver = ${email};',{
    email:req.params.email}).then(function(result){
    console.log(result);
    res.send(result);
    res.status(200);
    }).catch(function(error){
    res.send(error);
    res.status(400);
    });
})

app.get('/sent/:email',function(req,res){
    db.any('select * from Email where sender = ${email};',{
    email:req.params.email}).then(function(result){
    res.send(result);
    res.status(200);
    }).catch(function(error){
    res.send(error);
    res.status(400);
    });
})

app.get('/reply/:sender/:receiver/:subject/:body/:date/:time/:read_status',function(req,res){
    db.query('Insert into Email(sender,receiver,subject,body,date,time,read_status) values (${sender}, ${receiver}, ${subject}, ${body}, ${date}, ${time}, ${read_status});',{
    sender: req.params.sender,
    receiver: req.params.receiver,
    subject: req.params.subject,
    body: req.params.body,
    date: req.params.date,
    time: req.params.time,
    read_status: req.params.read_status
    }).then(function(result){
    console.log(result);
    res.send(result);}).catch(function(error){
    res.send(error);
    });
})
app.get('/deleted/:email',function(req,res){
    db.any('select * from Deleted where deleted_by = ${email};',{
    email:req.params.email}).then(function(result){
    res.send(result);
    res.status(200);
    }).catch(function(error){
    res.send(error);
    res.status(400);
    });
})

app.get('/insert_to_deleted/:id/:sender/:receiver/:subject/:body/:date/:time/:deleted_by',function(req,res){
	db.query('Insert into Deleted(sender,receiver,subject,body,date,time,deleted_by) values (${sender}, ${receiver}, ${subject}, ${body}, ${date}, ${time},   ${deleted_by});',{
    id: req.params.id,
    sender: req.params.sender,
    receiver: req.params.receiver,
    subject: req.params.subject,
    body: req.params.body,
    date: req.params.date,
    time: req.params.time,
    deleted_by: req.params.deleted_by}).then(function(result){
    console.log(result);
    res.send(result);}).catch(function(error){
    res.send(error);
    });
})

app.get('/delete/:id',function(req,res){
    db.query('delete from Email where id = ${id};',{
    id:req.params.id}).then(function(result){
    console.log(result);
    res.send(result);}).catch(function(error){
    res.send(error);
    });
})

app.get('/update_read_status/:read_status/:id',function(req,res){
    db.query('update Email set read_status = ${read_status} where id = ${id};',{
    read_status: req.params.read_status,
    id:req.params.id
    }).then(function(result){
    console.log(result);
    res.send(result);}).catch(function(error){
    res.send(error);
    });
})

app.get('/count_unread_emails/:email/:read_status',function(req,res){
    db.query('select count(*) from Email where receiver = ${email} and read_status = ${read_status};',{
    read_status: req.params.read_status,
    email:req.params.email
    }).then(function(result){
    console.log(result);
    res.send(result);}).catch(function(error){
    res.send(error);
    });
})

app.listen(3000, () => console.log('app listening on port 3000!'))



