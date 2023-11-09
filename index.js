const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.oiiyhkk.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );

    const bookCollection = client.db("booksinfodb").collection("booksinfo");
    const catagoryCollection = client.db("booksinfodb").collection("catagoriesinfo");
    const borrowedCollection = client
      .db("booksinfodb")
      .collection("borrowbook");

    app.post("/booksinfo", async (req, res) => {
      const newbook = req.body;
      const result = await bookCollection.insertOne(newbook);
      res.send(result);
    });

    app.get("/booksinfo", async (req, res) => {
      const cursor = bookCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/catagoriesinfo", async (req, res) => {
      const cursor = catagoryCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/booksinfo/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await bookCollection.findOne(query);
      res.send(result);
    });

    app.post("/borrowbook", async (req, res) => {
      const newbook = req.body;
      const result = await borrowedCollection.insertOne(newbook);
      res.send(result);
    });

    app.get("/borrowbook", async (req, res) => {
      const cursor = borrowedCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/borrowbook/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await borrowedCollection.findOne(query);
      res.send(result);
    });

    app.delete("/borrowbook/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await borrowedCollection.deleteOne(query);
      res.send(result);
    });

    app.patch("/booksinfo/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateBook = req.body;
      const updatedBook = {
        $set: {
          name: updateBook.name,
          author: updateBook.author,
          image: updateBook.image,
          format: updateBook.format,
          category: updateBook.category,
          quantity: updateBook.quantity,
          rating: updateBook.rating,
          short_description: updateBook.short_description,
        },
      };
      const result = await bookCollection.updateOne(
        filter,
        updatedBook,
        options
      );
      res.send(result);
    });
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", async (req, res) => {
  res.send("library-managment-server");
});

app.listen(port, () => {
  console.log(`Port is running on port ${port}`);
});
