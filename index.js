const express = require('express');

const app = express();
const handlebars = require('express-handlebars');

// Handlebars setup
app.set('view engine', 'handlebars');

app.engine('handlebars', handlebars({
    layoutsDir: __dirname + '/views/layouts',
}));

app.get('/', (req, res) => {
    res.render('main', {
        layout: 'index'
    });
});

// Routing
// app.use(express.static('public'));

// app.get('/about', (req, res) => {
//     res.send('About page');
// });

// app.get('/', (req, res) => {
//     res.render('index', {
//         layout: false,
//     });
// });

// app.get('/contact', (req, res) => {
//     res.send('Contact page');
// });

// Port
const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
app.listen(PORT, () => console.log(`App listening to port ${PORT}`));