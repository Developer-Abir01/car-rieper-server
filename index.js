const express = require('express')
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();






const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));

const port = process.env.PORT || 4500

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1arad.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;


app.get('/', (req, res) => {
  res.send('Hello World!')
})


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const ServiceCollection = client.db(`${process.env.DB_NAME}`).collection("service");
  const reviewCollection = client.db(`${process.env.DB_NAME}`).collection("review");
  

  app.post("/addReview", (req, res) => {
    const review = req.body
    reviewCollection.insertOne(review)
      .then(result => {
        res.send(result.insertedCount > 0)
      })


  })


  app.get("/reviews", (req, res) => {
    reviewCollection.find()
      .toArray((err, document) => {
        res.send(document)
      })
  })

  app.post("/addService", (req, res) => {
    const service = req.body
    ServiceCollection.insertOne(service)
    .then(result =>{
    res.send(result.insertedCount >0)
    })
  })
  

  app.get("/services",(req, res) =>{
    ServiceCollection.find()
    .toArray((err, document) =>{
      res.send(document)
    })
  })
 app.get("admin")
  

});





app.listen(process.env.PORT || port)