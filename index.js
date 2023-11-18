const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
const app = express()
require('dotenv').config();
const port = process.env.PORT || 5000;

// middle ware 
app.use(cors())
app.use(express.json())




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster1.fycfdwn.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const menuCollection = client.db("bistroDB").collection("menu");
    const reviewCollection = client.db("bistroDB").collection("reviews");
    const cartCollection = client.db("bistroDB").collection("cart");
    const userCollection = client.db("bistroDB").collection("users");

    // mange user
    app.get('/users', async (req, res) => {
      const result = await userCollection.find().toArray()
      res.send(result)
    })
    app.post('/users', async (req, res) => {
      const user = req.body;
      const query = { email: user.email }
      const exitsUser = await userCollection.findOne(query)
      if (exitsUser) {
        return res.send({message:'user already exits'} );
      }
      else {
        const result = await userCollection.insertOne(user)
        res.send(result)
      }
    })
    
    app.delete('/users/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) }
      const result = await cartCollection.deleteOne(query)
      res.send(result)
    })
    

    // food items  menu 
    app.get('/menu', async (req, res) => {
      const result = await menuCollection.find().toArray();
      res.send(result);
    })

    // customer review
    app.get('/reviews', async (req, res) => {
      const result = await reviewCollection.find().toArray();
      res.send(result);
    })

    // cart 
    app.get('/cart', async (req, res) => {
      const email = req.query.email;
      const query = {email:email}
      const result = await cartCollection.find(query).toArray();
      res.send(result)
    })
    app.post('/cart', async(req, res)=> {
      const query = req.body;
      const result = await cartCollection.insertOne(query)
      res.send(result)
    })
    app.delete('/cart/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) }
      const result =await cartCollection.deleteOne(query)
      res.send(result)
    })



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




// server runnig
app.get('/', (req, res) => {
  res.send('boss is fokir')
})
app.listen(port, () => {
  console.log('boss running at port', port);
})