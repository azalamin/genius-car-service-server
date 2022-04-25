const express = require("express");
const cors = require("cors");
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 5000;

const app = express();

// use middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.oxgvp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    client.connect();
    const serviceCollection = client.db("geniusCar").collection("services");
    const orderCollection = client.db('geniusCar').collection("order");


    // Auth
    app.post('/login', async(req, res) => {
      const user = req.body;
      const accessToken = jwt.sign()
    })

    // get service from database
    app.get("/services", async (req, res) => {
      const query = {};
      const cursor = serviceCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    // insert data to database
    app.post("/services", async (req, res) => {
      const service = req.body;
      const result = await serviceCollection.insertOne(service);
      res.send(result);
    });

    // specific data
    app.get("/service/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await serviceCollection.findOne(query);
      res.send(result);
    });

    // delete data
    app.delete("/service/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await serviceCollection.deleteOne(query);
      res.send(result);
    });

    // Order Collection API
    app.get('/order', async (req, res) => {
      const email = req.query.email;
      const query ={email: email};
      const cursor = orderCollection.find(query);
      const orders = await cursor.toArray();
      res.send(orders)
    })

    app.post('/order', async(req, res) => {
      const order = req.body;
      const orderDetail = await orderCollection.insertOne(order);
      res.send(orderDetail);
    })


  } finally {
    // client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Genius Car is running");
});

app.listen(port, () => {
  console.log("Listening to", port);
});
