const express = require('express')
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const fileUpload = require('express-fileUpload');






const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('service'));
app.use(fileUpload());

const port = process.env.PORT || 4500

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1arad.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;


app.get('/', (req, res) => {
  res.send('Hello World!')
})


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const ServiceCollection = client.db(`${process.env.DB_NAME}`).collection("service");
  const reviewCollection = client.db(`${process.env.DB_NAME}`).collection("review");
  const adminCollection = client.db(`${process.env.DB_NAME}`).collection("admin");

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

  // app.post("/addService", (req, res) => {
  //   const file = req.files.file;
  //   const name = req.body.name;
  //   const price = req.body.price;
  //   const description = req.body.description;
  //   console.log(file, name, price, description);
  //   file.mv(`${__dirname}/service/${file.name}`)
  // })

  app.post("/addService", (req, res) => {

    const product = req.body
    ServiceCollection.insertOne(product)
      .then(result => {
        res.send(result.insertedCount > 0)
      })
  })

  app.get("/service", (req, res) => {
    ServiceCollection.find()
      .toArray((err, document) => {
        res.send(document)
      })
  })

  app.post('/AddAdmin', (req, res) => {
    const file = req.files.file;
    const name = req.body.name;
    const email = req.body.email;
    const newImg = file.data;
    const encImg = newImg.toString('base64');

    var image = {
      contentType: file.mimetype,
      size: file.size,
      img: Buffer.from(encImg, 'base64')
    };

    adminCollection.insertOne({ name, email, image })
      .then(result => {
        res.send(result.insertedCount > 0);
      })
  })

  app.get('/isAdmin', (req, res) => {
    adminCollection.find({})
      .toArray((err, documents) => {
        res.send(documents);
      })
  });

  app.post('/isAdmin', (req, res) => {
    const email = req.body.email;
    adminCollection.find({ email: email })
      .toArray((err, doctors) => {
        res.send(doctors.length > 0);
      })
  })

});

});





app.listen(process.env.PORT || port)