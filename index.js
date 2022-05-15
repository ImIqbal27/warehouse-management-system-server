const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const res = require('express/lib/response');



//middleware 

app.use(cors());
app.use(express.json());
//////////////////////////////////////  database connection  //////////////////////////////////////

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.8e7vo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
////////////// async run function : try ... finally ///////////////////
async function run() {
    try {
        await client.connect();
        const productsCollection = client.db('warehouse').collection('products');
        ///////////  for get all  products from db on UI ///////////////
        app.get('/products', async (req, res) => {
            const query = {};
            const cursor = productsCollection.find(query);
            const products = await cursor.toArray();
            res.send(products);
        });
        ///////////  for get single data/product from db on UI ////////////
        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const product = await productsCollection.findOne(query);
            res.send(product);

        });
        ////////////////   post data on db  ////////////////
        app.post('/product', async (req, res) => {
            const newProduct = req.body;
            const result = await productsCollection.insertOne(newProduct);
            res.send(result);
        });
        ///////////////////    add/update product quantity     //////////
        app.put('/products/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const updatedQty = req.body;
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    quantity: updatedQty.newQtyNumber,
                }
            }

            const result = await productsCollection.updateOne(filter, updatedDoc, options);

            res.send(result);

        });

        //////////////     restock   product  ////////////////
        app.put('/products/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const restockQty = req.body;
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    // quantity: updateRestock,
                    quantity: restockQty,
                }
            }
            console.log(restockQty);

            const result = await productsCollection.updateOne(filter, updatedDoc, options);

            res.send(result);

        });

        /////////////////    delete single data/product /////////
        app.delete('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await productsCollection.deleteOne(query);
            res.send(result)

        });



    }
    finally {

    }

}
run().catch(console.dir);




///////////////////////////////////////////////////////////////////////////////////////////////
app.get('/', (req, res) => {
    res.send('Running Warehouse Management Server');

});

app.listen(port, () => {
    console.log('Listening');
})

//     git  add .
//     git commit -m "  solved"
//      git push
//     git push  heroku main