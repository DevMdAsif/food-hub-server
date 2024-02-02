const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.port || 5000;

app.use(express.json());
app.use(cors());

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_userName}:${process.env.DB_password}@cluster0.dkwcfqt.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

console.log();

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection

    const foodsCollection = client.db("food-hub").collection("foods");
    const reviewCollection = client.db("food-hub").collection("reviews");

    // get foods from DB

    app.get("/api/foods", async (req, res) => {
      try {
        const result = await foodsCollection.find().toArray();
        res.send(result);
      } catch (error) {
        console.error("Error fetching foods:", error);
        res.status(500).send("Internal Server Error");
      }
    });

    app.get("/api/reviews", async (req, res) => {
      try {
        const result = await reviewCollection.find().toArray();
        res.send(result);
      } catch (error) {
        console.error("Error fetching foods:", error);
        res.status(500).send("Internal Server Error");
      }
    });

    app.get("/", (req, res) => {
      res.send("Hello World!");
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
