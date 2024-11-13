
// connectDB();
const express = require('express')
const app = express()
const cors = require('cors')
const port = 3000

app.use(cors())
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello ITD Dev')
})

app.listen(port, () => {
    console.log(`App is running on http://localhost:${port}`)
})

const {MongoClient, ObjectId} = require('mongodb');
// const uri = 'mongodb://localhost:27017';
const uri = "mongodb://127.0.0.1:27017/";

// const connectDB = async() => {
//     try {
//         const client = new MongoClient(uri);
//         await client.connect();
//         console.log('MongoDB is now conneted.')

//     } catch (error) {
//         console.log(error);
//         process.exit(1);
//     }
// }

// connectDB();

app.get('/slist', async(req, res) => {
    const client = new MongoClient(uri);
    await client.connect();
    // const objects = await client.db('mydb').collection('s_collection').find({}).sort({"GPA": -1}).limit(10).project({_id:0, GPA:0, Savings:0, Salary:0}).toArray();
    const objects = await client.db('dbps').collection('psgame').find({}).sort({"GPA": -1}).toArray();
    await client.close();
    res.status(200).send(objects);

})

app.post('/slist/create', async(req, res) => {
    const object = req.body;
    const client = new MongoClient(uri);
    await client.connect();
    await client.db('dbps').collection('psgame').insertOne({
        "_id ": object['_id'],
        "Title": object['Title'],
        "Developer": object['Developer'],
        "Publisher": object['Publisher'],
        "Japan": object['Japan'],
        "Europe/PAL": object['Europe/PAL'],
        "North_America": object['North_America'],
        
    });

    await client.close();
    res.status(200).send({
        "status": "ok",
        "message": "Object is created",
        "object": object['_id']
    })
})

app.put('/slist/update', async(req, res) => {
    const object = req.body;
    const id = object._id;
    const client = new MongoClient(uri);
    await client.connect();
    await client.db('dbps').collection('psgame').updateOne({'_id': ObjectId(id)}, 
    {"$set": {
        
        "Title": object['Title'],
        "Developer": object['Developer'],
        "Publisher": object['Publisher'],
        "Japan": object['Japan'],
        "Europe/PAL": object['Europe/PAL'],
        "North_America": object['North_America'],
        
    }});
    await client.close();
    res.status(200).send({
        'status': "ok",
        'message': "Object with ID "+id+" is updated.",
        'object': object
    });
})

app.delete('/slist/delete', async(req, res) => {
    const id = req.body._id;
    const client = new MongoClient(uri);
    await client.connect();
    await client.db('dbps').collection('psgame').deleteOne({"_id": ObjectId(id)});
    await client.close();
    res.status(200).send({
        "status": "ok",
        "message": "Object with ID"+ id + " is deleted."
    });
})


app.get('/slist/field/:searchText', async(req, res) => {
        const { params } = req;
        const searchText = params.searchText
        const client = new MongoClient(uri);
        await client.connect();
        const objects = await client.db('dbps').collection('psgame').find({ $text: {$search: searchText } }).sort({ "Date received": -1 }).limit(5).toArray();
        await client.close();
        res.status(200).send({
          "status": "ok",
          "searchText": searchText,
          "Complaint": objects
        });
      })

app.get('/slist/:id', async(req, res) => {
        const id = req.params.id;
        const client = new MongoClient(uri);
        await client.connect();
        const object = await client.db('dbps').collection('psgame').findOne({ "_id": ObjectId(id) });
        await client.close();
        res.status(200).send({
            "status": "ok",
            "ID": id,
            "Complaint": object
        });
    })