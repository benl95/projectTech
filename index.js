const express = require('express');
const app = express();
const expbs = require('express-handlebars');
const path = require('path');
const bodyParser = require('body-parser');

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

// POST method playlist
app.post('/playlist', (req, res) => {
    // res.end(JSON.stringify(req.body));
    console.log(req.body);
    res.render('playlist-added', {
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