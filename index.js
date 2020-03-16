const express = require('express');
const app = express();
const expbs = require('express-handlebars');
const path = require('path');
const bodyParser = require('body-parser');
const {
    MongoClient
} = require('mongodb');
require('dotenv').config()

// MongoDB connection setup
async function main() {

    const uri = 'mongodb+srv://admin:' + process.env.DB_PASS + '@projecttech-a3phf.mongodb.net/test'


    const client = new
    MongoClient(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })

    try {
        // Connect to the MongoDB cluster
        await client.connect();

        // Make the appropriate DB calls
        await listDatabases(client);

    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

main().catch(console.error);

// Database function retrieve list databases

async function listDatabases(client) {
    databasesList = await client.db().admin().listDatabases();

    console.log("Databases:");
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));
};

// Handlebars setup
app.engine('handlebars', expbs({
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views/layouts')
}));

app.set('view engine', 'handlebars');

// Body Parser setup

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());


// Static folders 
app.use(express.static(path.join(__dirname, '/public')));

// Routing index
app.get('/', (req, res) => {
    res.render('index', {
        title: 'Seek matches'
    });
});

// Routing playlist 
app.get('/playlist', (req, res) => {
    res.render('playlist', {
        title: 'Your playlist'
    });
});

// Routing songs
app.get('/songs', (req, res) => {
    res.render('songs', {
        title: 'Add songs to your playlist'
    });
});

// POST method songs
app.post('/songs', (req, res) => {
    console.log(req.body);
    res.render('songs-added', {
        data: req.body
    });
});

// Routing mp3
app.get('/mp3', (req, res) => {
    res.sendFile(path.join(__dirname,
        'public', 'sample.mp3'));
});

// Routing retrieving parameters
app.get('/profile/:id', (req, res) => {
    res.send('You requested to see the profile of ' + req.params.id);
});

app.listen(8080, () => {
    console.log('Server is starting on port', 8080);
});