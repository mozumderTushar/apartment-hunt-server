const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const MongoClient = require('mongodb').MongoClient;


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jos17.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express()

app.use(bodyParser.json())
app.use(cors())

const port = 5000




const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const apartmentCollection = client.db("apartmentHunt").collection("apartment");
  const rentCollection = client.db("apartmentHunt").collection("rent");
  // perform actions on the collection object
  console.log('db connection successful')

  //post all fakeData to server
  app.post('/apartments', (req, res) => {
    const apartmentInfo = req.body;
    rentCollection.insertMany(apartmentInfo)
      .then(result => {
        console.log(result.insertedCount)
        res.send(result.insertedCount)
      })
  })

  // add rent to server
  app.post('/addRent', (req, res) => {
    const rent = req.body;
    rentCollection.insertOne(rent)
      .then(result => {
        console.log(result)
        res.send(result)
      })
  })
});

  //get all apartment Info from server
  app.get('/allApartments', (req, res) => {
    rentCollection.find({})
      .toArray((err, documents) => {
        res.send(documents)
      })
  })


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(process.env.PORT || port)