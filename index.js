const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require('mongodb');



//middleware 

app.use(cors());
app.use(express.json());
//////////////////////////////////////  database connection  //////////////////////////////////////

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.8e7vo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
    const collection = client.db("test").collection("devices");
    console.log('warehouse db connect..')
    // perform actions on the collection object
    client.close();
});



///////////////////////////////////////////////////////////////////////////////////////////////
app.get('/', (req, res) => {
    res.send('Running Warehouse Management Server');

});

app.listen(port, () => {
    console.log('Listening');
})