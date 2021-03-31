const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv/config');
const Item = require('./model/Item');
const expressLayouts = require('express-ejs-layouts');
const layout = require('express-layout');
const path = require('path');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: "TODO List",
            description: "Just a TODO List",
            contact: {
                name: "Richárd Stempel"
            },
            server: "http://localhost:8000/"
        }
    },
    apis: ["src/app.js"]
}

const swaggerDocs = swaggerJsDoc(swaggerOptions);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

const middlewares = [
    layout(),
    express.static(path.join(__dirname, 'public'))
];

/**
 * @swagger
 * /:
 *  get:
 *      description: Use to request all the items in the TODO-List
 *      responses:
 *          '200':
 *              description: A successful response
 */
app.get('/', async (req, res) => {
    try {
        const items = await Item.find();
        res.render('index', { items: items });
    } catch (err) {
        res.send({ message: err });
    }
});

/**
 * @swagger
 * /addItem:
 *  post:
 *      description: Use to create a new item and redirects us to '/'
 *      responses:
 *          '200':
 *              description: Item creation was successful
 */
app.post('/', async (req, res) => {
    try {
        const item = new Item({
            todo: req.body.todo
        });
        const savedItem = await item.save();
        res.redirect("/");
    } catch (err) {
        res.json({ message: err });
    }
});

/**
 * @swagger
 * /deleteItem/:itemId:
 *  post:
 *      description: Delete an item that has a maching id with the itemId
 *      responses:
 *          '200':
 *              description: Item deleted successfully
 */
app.post('/deleteItem/:itemId', async (req, res) => {
    try {
        const removerItem = await Item.deleteOne({ _id: req.params.itemId });
        res.redirect("/");
    } catch (err) {
        res.json({ message: err });
    }
});

/**
 * @swagger
 * /updateeItem/:itemId:
 *  get:
 *      description: Open the edit page for an item
 *      responses:
 *          '200':
 *              description: A successful response
 */
app.get('/updateItem/:itemId', async (req, res) => {
    try {
        const item = await Item.findById(req.params.itemId)
        res.render('update', { item: item });
    } catch (err) {
        res.send({ message: err });
    }
});

/**
 * @swagger
 * /updateItem/:itemId:
 *  post:
 *      description: Update an item that has a maching id with the itemId
 *      responses:
 *          '200':
 *              description: Item succcessfully updated
 */
app.post('/updateItem/:itemId', async (req, res) => {
    try {
        const updatedItem = await Item.updateOne(
            { _id: req.params.itemId },
            { $set: { todo: req.body.todo } }
        );
        res.redirect("/");
    } catch (err) {
        res.json({ message: err });
    }
})

mongoose.connect(
    process.env.DB_CONNECT,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => console.log('connected to the db')
);

app.listen(8000, () => console.log('App listening on port 8000.'));