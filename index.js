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
const session = require('express-session')
const MongoStore = require('connect-mongo')(session);
const expressValidator = require('express-validator');
const PORT = 8080


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
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

main().catch(console.error);

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

// Session setup
app.use(session({
    secret: 'secret-key',
    saveUninitialized: false,
    resave: false
}))

// Validator setup
app.use(expressValidator())

// Mongoose schema playlist
const favourite = new mongoose.Schema({
    song: String,
    artist: String,
});

// Model playlist
const PlayList = mongoose.model('PlayList', favourite)

// Posting
// Posting music data to MongoDB
app.post('/songs', (req, res) => {
    const new_PlayList = new PlayList({
        song: req.body.songName,
        artist: req.body.artistName,

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

// Update song from playlist in database 
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

// Routing 
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

// Routing login
app.get('/login', (req, res) => {
    res.render('login', {
        title: 'Log in'
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
app.get('/songs', (req, res) => {
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

app.listen(PORT, () => {
    console.log('Server is starting on port', PORT);
});