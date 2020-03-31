const express = require('express');
const app = express();
const expbs = require('express-handlebars');
const path = require('path');
const bodyParser = require('body-parser');
const {
    MongoClient
} = require('mongodb');
require('dotenv').config()
const mongoose = require('mongoose');

// Mongoose connection setup
const uri = 'mongodb+srv://admin:' + process.env.DB_PASS + '@projecttech-a3phf.mongodb.net/test'

mongoose.connect(uri || 'mongodb://localhost/playlist', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.connection.on('connected', () => {
    console.log('Mongoose is connected');
});

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

// Mongoose Schema 
const Schema = new mongoose.Schema({
    song: String,
    artist: String
});

// Model
const PlayList = mongoose.model('PlayList', Schema)

// Posting music data to MongoDB
app.post('/songs', (req, res) => {
    const new_PlayList = new PlayList({
        song: req.body.songName,
        artist: req.body.artistName
    });
    new_PlayList.save((error) => {
        if (error) {
            console.log('There was an error');
        } else {
            console.log('Songs have been successfully added');
        }
        res.render('songs-added')
    });
});

// Update song/artist
app.post('/update', (req, res) => {
    PlayList.findOneAndUpdate({
        song: req.body.songName,
        artist: req.body.artistName
    }, {
        $set: {
            song: req.body.newSongName,
            artist: req.body.newArtistName
        }
    }, {
        new: true
    }, (err, doc) => {
        if (err) {
            console.log('Something went wrong')
        } else {
            console.log('Successfully updated')
        }
        console.log(doc)
    })
})

// Routing pages

// Get playlist data from DB and render it to HBS
app.get('/playlist', (req, res) => {
    PlayList.find({}, function (err, playlists, ) {
        if (err) return handleError(err)
        res.render('playlist', {
            playlists: playlists,
            title: 'Your playlist'
        })
    })
})

// Routing index
app.get('/', (req, res) => {
    res.render('index', {
        title: 'Seek matches'
    });
});

// Routing profile 
app.get('/profile', (req, res) => {
    res.render('profile', {
        title: 'Profile settings'
    });
});

// Routing view playlist user {
app.get('/view-playlist', (req, res) => {
    res.render('view-playlist', {
        title: 'Playlist'
    });
});

// Routing songs
app.get('/songs', function (req, res) {
    res.render('songs', {
        title: 'Add songs to your playlist'
    });
});

// Routing update
app.get('/update', (req, res) => {
    res.render('update', {
        title: 'Update playlist'
    });
});

// Routing retrieving parameters
app.get('/profile/:id', (req, res) => {
    res.send('You requested to see the profile of ' + req.params.id);
});

app.listen(8080, () => {
    console.log('Server is starting on port', 8080);
});

// Team feature

// Routing
app.get('/teamfeature', (req, res) => {
    res.render('teamfeature', {
        title: 'team feature'
    });
});

app.get('/top5', (req, res) => {
    res.render('top5', {
        title: 'team feature'
    });
});

// Mongoose Schema 
// const favorite = new mongoose.Schema({
//     song1: String,
//     artist1: String,
//     song2: String,
//     artist2: String,
// });

// Model
// const top5 = mongoose.model('top5', favorite)

// app.post('/teamfeature', (req, res) => {
//     const new_top5 = new top5({
//         song1: req.body.songName,
//         artist1: req.body.artistName,
//         song2: req.body.songName2,
//         artist2: req.body.artistName2
//     });
//     new_top5.save((error) => {
//         if (error) {
//             console.log('There was an error');
//         } else {
//             console.log('Songs have been successfully added');
//         }
//         res.render('top5', {
//             top5: new_top5
//         })
//     });
// });

// Get playlist data from DB and render it to HBS
// app.get('/top5', (req, res) => {
//     top5.find({}, function (err, top5, ) {
//         if (err) return handleError(err)
//         res.render('top5', {
//             top5: top5,
//             title: 'team feature'
//         })
//     })
// })