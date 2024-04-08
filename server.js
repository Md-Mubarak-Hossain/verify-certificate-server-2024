const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express()
const port = process.env.PORT || 5000;
require("dotenv").config()


app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Verify certificate server is running!')
})
const password = encodeURIComponent(`${process.env.DB_PASS}`);
const uri = `mongodb+srv://mubarak:${password}@mubarak-world-all-proje.tmrqr0p.mongodb.net/?retryWrites=true&w=majority&appName=mubarak-world-all-projects`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const database = client.db("verifyCertificate");
        const certificateCollection = database.collection("DataHouse");
        const postCollection = database.collection("postData");
        const verifiedCollection = database.collection("verifiedData");
// Data collection server
        app.get('/certificate', async (req, res) => {
            const query = {};
            const cursor = certificateCollection.find(query);
            const result = await cursor.toArray();
            res.send(result)
        })
        app.get('/certificate/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id:new ObjectId(id) };
            const result = await certificateCollection.findOne(query);
            res.send(result)
        })
// user or organization post data
        app.get('/post', async (req, res) => {
            const query = {};
            const cursor = postCollection.find(query);
            const result = await cursor.toArray();
            res.send(result)
        })
        app.get('/post/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await postCollection.findOne(query);
            res.send(result)
        })
        app.delete('/post/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await postCollection.deleteOne(query);
            res.send(result)
        })
        app.post('/post', async (req, res) => {
            const user = req.body;
            const result = await postCollection.insertOne(user);
            console.log(result);
            res.send(result);
        })
        app.patch('/post/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const information = req.body;
            const updatePostData = {
                $set: { id: information.id,
                    uid: information.uid,
                    user: information.user,
                    userEmail: information.userEmail,
                    contact: information.contact, 
                    image: information.image,
                    roll: information.roll,
                    registration: information.registration,
                    name: information.name,
                    email: information.email,
                    university: information.university,
                    country: information.country,
                    author: information.author,
                    journal: information.journal,
                    session: information.session,
                   
                    
                }
            }
            const result = await postCollection.updateOne(filter, updatePostData)
            res.send(result)
        })
        app.delete('/post/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await postCollection.deleteOne(query);
            res.send(result);
        })

// User or organization match data with data house
        app.get('/verified', async (req, res) => {
            const query = {};
            const cursor = verifiedCollection.find(query);
            const result = await cursor.toArray();
            res.send(result)
        })
        app.post('/verified', async (req, res) => {
            const user = req.body;
            const result = await verifiedCollection.insertOne(user);
            console.log(result);
            res.send(result);
        })

    }
    finally {
        // await client.close();
        app.get("/*",async(req,res)=>{
            res.send("This collection is not create yet!")
        })
    }
}
run().catch(err => console.error(err))

app.listen(port, () => {
    console.log(`verify certificate server-2024 listening on port ${port}`)
})