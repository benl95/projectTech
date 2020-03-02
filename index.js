const express = require('express');
const app = express();
const expbs = require('express-handlebars');
const path = require('path');

// Handlebars setup
app.engine('handlebars', expbs({
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views/layouts')
}));
app.set('view engine', 'handlebars');

// Static folders 
app.use(express.static(path.join(__dirname, '/public')));

// Routing
app.get('/', (req, res) => {
    res.render('index', {
        title: 'Seek matches'
    });
});

app.get('/playlist', (req, res) => {
    res.render('playlist', {
        title: 'Results'
    });
});

app.get('/form', (req, res) => {
    res.render('form', {
        title: 'Movie form'
    });
});

app.listen(8080, () => {
    console.log('Server is starting on port ', 8080);
});