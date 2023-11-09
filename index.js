const express = require('express');
var cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zgm5tdq.mongodb.net/?retryWrites=true&w=majority`;

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
        // await client.connect();

        const jobsCollection = client.db("careerfy").collection("jobs");
        const appliedJobsCollection = client.db("careerfy").collection("appliedJobs");

        app.get('/jobs', async (req, res) => {
            const cursor = await jobsCollection.find().toArray();
            res.send(cursor);
        })

        app.get('/job-details/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await jobsCollection.findOne(query);
            res.send(result);
        })

        app.get('/update-job/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await jobsCollection.findOne(query);
            res.send(result);
        })

        app.get('/jobs/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const result = await jobsCollection.find(query).toArray();
            res.send(result);
        })

        app.get('/applied-jobs', async (req, res) => {
            const email = req.query?.email;
            const query = { email: email };
            const result = await appliedJobsCollection.find(query).toArray();
            res.send(result);
        })

        app.post('/jobs', async (req, res) => {
            const job = req.body;
            const doc = {
                title: job.title,
                name: job.name,
                email: job.email,
                category: job.category,
                salary_range: job.salary,
                banner_url: job.banner_url,
                applicant_number: job.applicant,
                posting_date: job.postingDate,
                deadline: job.deadline,
                description: job.description
            }
            const result = await jobsCollection.insertOne(doc);
            res.send(result);
        })

        app.post('/applied-jobs', async (req, res) => {
            const doc = req.body;
            const result = await appliedJobsCollection.insertOne(doc);
            res.send(result);
        })

        app.put('/jobs/:id', async (req, res) => {
            const id = req.params.id;
            const doc = req.body;
            const filter = { _id: new ObjectId(id) };
            const updateDoc = {
                $set: {
                    title: doc.title,
                    name: doc.name,
                    category: doc.category,
                    salary_range: doc.salary,
                    banner_url: doc.banner_url,
                    applicant_number: doc.applicant,
                    posting_date: doc.postingDate,
                    deadline: doc.deadline,
                    description: doc.description
                }
            }
            const result = await jobsCollection.updateOne(filter, updateDoc);
            res.send(result);
        })

        app.patch('/applicant-number/:id', async (req, res) => {
            const id = req.params.id;
            const updateData = req.body;
            const filter = { _id: new ObjectId(id) };
            const updateDoc = {
                $set: {
                    applicant_number: updateData.applicant_number
                }
            }
            const result = await jobsCollection.updateOne(filter, updateDoc);
            res.send(result);
        })

        app.delete('/jobs/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await jobsCollection.deleteOne(query);
            res.send(result);
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

app.get('/', (req, res) => {
    res.send('Careefy server is running...');
})

app.listen(port, () => {
    console.log(`Career server running port : ${port}`);
})