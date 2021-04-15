const express = require('express')
const MongoClient = require('mongodb').MongoClient;
const app = express()
const port = process.env.PORT || 6500

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1arad.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;


app.get('/', (req, res) => {
  res.send('Hello World!')
})


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db(`${process.env.DB_NAME}`).collection("service");
  // perform actions on the collection object
  client.close();
});





app.listen(port)