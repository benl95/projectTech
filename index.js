const express = require('express');

const app = express();

//Set static folder
//app.get('/', (req, res) => {
//    res.sendFile(__dirname + '/index.html');
// });

app.use(express.static('public'));

app.get('/about', (req, res) => {
    res.send('About page');
});

app.get('/contact', (req, res) => {
    res.send('Contact page');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));