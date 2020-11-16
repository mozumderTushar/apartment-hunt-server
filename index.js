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
  const bookingCollection = client.db("apartmentHunt").collection("booking");
  // perform actions on the collection object
  console.log('db connection successful')

  //post all fakeData to server
  app.post('/apartments', (req, res) => {
    const apartmentInfo = req.body;
    rentCollection.insertMany(apartmentInfo)
      .then(result => {
        console.log(result)
        res.send(result)
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

   // add booking to server
   app.post('/booking', (req, res) => {
    const book = req.body;
    bookingCollection.insertOne(book)
      .then(result => {
        console.log(result)
        res.send(result)
      })
  })

  //get all booking Info from server
  app.get('/allBookings', (req, res) => {
    bookingCollection.find({})
      .toArray((err, documents) => {
        res.send(documents)
      })
  })

    //get all apartment Info from server
    app.get('/allApartments', (req, res) => {
      rentCollection.find({})
        .toArray((err, documents) => {
          res.send(documents)
        })
    })

});



app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(process.env.PORT || port)