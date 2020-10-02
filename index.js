const express = require('express')
require('dotenv').config()
const bodyParser = require('body-parser')
const cors = require('cors')
const MongoClient = require('mongodb').MongoClient;


const uri = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0-shard-00-00.4xssl.mongodb.net:27017,cluster0-shard-00-01.4xssl.mongodb.net:27017,cluster0-shard-00-02.4xssl.mongodb.net:27017/${process.env.DB_NAME}?ssl=true&replicaSet=atlas-3sy2t9-shard-0&authSource=admin&retryWrites=true&w=majority`;
const app = express()
const port = 5000;

app.use(bodyParser.json());
app.use(cors());




const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology:true});
client.connect(err => {
  const productsCollection = client.db("emaJhoneStore").collection("products");
  const ordersCollection = client.db("emaJhoneStore").collection("orders");
  app.post('/addProduct', (req,res) => {
    const products = req.body;  
    productsCollection.insertOne(products)
    .then(result => {
        res.send(result.insertedCount > 0)
    })
  })
  app.post('/productsByKeys', (req,res) => {
    const productKeys = req.body;  
    productsCollection.find({key: {$in: productKeys}})
    .toArray( (err, documents) => {
        res.send(documents);
    })
    
  })


app.get('/products', (req, res) => {
    productsCollection.find({})
    .toArray( (err, documents) => {
        res.send(documents);
    })
})

app.get('/product/:key', (req, res) => {
    productsCollection.find({key: req.params.key})
    .toArray( (err, documents) => {
        res.send(documents[0]);
    })
})

app.post('/addOrder', (req,res) => {
    const order = req.body;  
    ordersCollection.insertOne(order)
    .then(result => {
        res.send(result.insertedCount > 0)
    })
  })
});


app.get('/', (req, res) =>{
    res.send('welcome to emajhon sarver')
});

app.listen(process.env.PORT || port)