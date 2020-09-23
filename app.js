const express = require("express");
const app = express();
const morgan = require("morgan");
const fs = require("fs");
const chalk = require("chalk");
const port = process.env.PORT || 5500;
const cors = require("cors");
app.use(cors());

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const mongo = require("mongodb");
const MongoClient = mongo.MongoClient;
const mongoUrl = "mongodb+srv://dbAnnu:dbAnnu1600@cluster0.ujlb1.mongodb.net/edumato?retryWrites=true&w=majority"

app.use(morgan("tiny", {
    stream: fs.createWriteStream("mylogs.logs", {flags:"a"})
}))

app.get("/", (req,res) => {
    res.status(200).send("This is Home Page");
});

//City List
app.get('/location',(req,res) => {
    db.collection('city').find({}).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

// app.get("/restaurants/:city_name", (req,res) => {
//     let filterCity = {city_name: req.params.city_name}

//     db.collection("restaurants").find(filterCity).toArray((err, result) => {
//         if(err) throw err;
//         res.send(result)
//     });
// });

// app.get("/restaurants/:mealtype", (req,res) => {
//     let filterCity = {"type.mealtype": req.params.mealtype}

//     db.collection("restaurants").find(filterCity).toArray((err, result) => {
//         if(err) throw err;
//         res.send(result)
//     });
// });

//Meal Type
app.get('/mealtype',(req,res) => {
    db.collection('mealtype').find({}).toArray((err,result) =>{
        if(err) throw err;
        res.send(result)
    })
})

//Cusine
app.get('/cuisine',(req,res) => {
    db.collection('cuisine').find({}).toArray((err,result) =>{
        if(err) throw err;
        res.send(result)
    })
})

//Restaurant
app.get('/restaurants',(req,res) => {
    var query = {};
    if(req.query.city && req.query.mealtype){
        query={city:req.query.city,"type.mealtype":req.query.mealtype}
    }
    else if(req.query.city){
        query={city:req.query.city}
    }
    else if(req.query.mealtype){
        query={"type.mealtype":req.query.mealtype}
    }
    db.collection('restaurants').find(query).toArray((err,result) =>{
        if(err) throw err;
        res.send(result)
    })
})

app.get('/restaurantDetails/:id',(req,res) => {
    //  
    var query = {_id:req.params.id}
    db.collection('restaurants').find(query).toArray((err,result) =>{
        if(err) throw err;
        res.send(result)
    })
});

// FILTER

app.get("/restaurants/:mealtype", (req, res) => {
    let query = {"type.mealtype": req.params.mealtype};
    let sort = {cost:1}
    if(req.query.city && req.query.sort){
        query = {"type.mealtype":req.params.mealtype,"city":req.query.city}
        sort = {cost:Number(req.query.sort)}
    }else if(req.query.cuisine && req.query.sort){
        query = {"type.mealtype":req.params.mealtype,"Cuisine.cuisine":req.query.cuisine}
        sort = {cost:Number(req.query.sort)}
    }else if(req.query.lcost && req.query.hcost && req.query.sort){
        query = {"type.mealtype":req.params.mealtype,"cost":{$gt:parseInt(req.query.lcost),$lt:parseInt(req.query.hcost)}}
        sort = {cost:Number(req.query.sort)}
    }else if(req.query.city){
        query = {"type.mealtype":req.params.mealtype,"city":req.query.city}
    }else if(req.query.cuisine){
        query = {"type.mealtype":req.params.mealtype,"Cuisine.cuisine":req.query.cuisine}
    }else if(req.query.lcost && req.query.hcost){
        query = {"type.mealtype":req.params.mealtype,"cost":{$gt:parseInt(req.query.lcost),$lt:parseInt(req.query.hcost)}}
    }

    db.collection("restaurants").find(query).sort(sort).toArray((err, result) => {
        if(err) throw err;
        res.send(result)
    })
});

//orders
app.get('/orders',(req,res) => {
    db.collection('orders').find({}).toArray((err,result) =>{
        if(err) throw err;
        res.send(result)
    })
});

//placeorder
app.post('/placeorder',(req,res) => {
    // console.log(">>>><<<<<<<<<<<<<",req.body.name)
    db.collection('orders').insertOne(req.body,(err,result) => {
        if(err){
            throw err
        }else{
            res.send('Data Added')
        }
    })
});



MongoClient.connect(mongoUrl,{ useUnifiedTopology: true }, (err, client) => {
    if (err) throw err;
    db = client.db("edumato")

    app.listen(port,(err) => {
        if(err) throw err;
        console.log(chalk.green(`server is running on port number ${5500}`));
    });
});









