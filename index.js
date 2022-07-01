const express = require('express');
const cors = require('cors');

const { query } = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = process.env.PORT || 5000;

//use middleware
app.use(cors());
app.use(express.json());


//User1
//SrdWNC2FZuowO5h5



const uri = "mongodb+srv://User1:SrdWNC2FZuowO5h5@cluster0.e8qk8.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {

    try {
        await client.connect();
        const userCollection = client.db("todoTest").collection("user");
        // const user = { task: 'Reading for one hour' };
        // const result = await userCollection.insertOne(user);
        // console.log(`User inserted with id: ${result.insertedId}`);


        //get 
        app.get('/user', async (req, res) => {
            const query = {};
            const cursor = userCollection.find(query);
            const users = await cursor.toArray();
            res.send(users);
        })

        //post dada, add
        app.post('/user', async (req, res) => {
            const newUser = req.body;
            console.log('added new user', newUser);
            const result = await userCollection.insertOne(newUser);
            res.send(result);
            // res.send({ result: 'success ' });
        });

        //delete
        app.delete('/user/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await userCollection.deleteOne(query);
            res.send(result);
        });

        //update
        app.put('/user/:id', async (req, res) => {
            const id = req.params.id;
            const updateData = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    task: updateData.task,
                }
            };
            const result = await userCollection.updateOne(filter, updateDoc, options);
            res.send(result);

        });

        app.get('/user/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await userCollection.findOne(query);
            res.send(result);
        })



    }

    finally {
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Running app.........');
});

app.listen(port, () => {
    console.log('Server is running');
})