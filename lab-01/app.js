
const express = require('express');

const app = express();

// Home route
app.get('/', (req, res) => {
    res.status(200).send('Welcome to my Express server!');
});

// About route
app.get('/about', (req, res) => {
    res.status(200).json({
        name: 'Tejaswini',
        course: 'CSE DS'
    });
});

// Time route
app.get('/time', (req, res) => {
    res.status(200).send(new Date().toString());
});

// 404 route
app.use((req, res) => {
    res.status(404).send('Page Not Found');
});

// Start server
app.listen(3000, () => {
    console.log('Express server running on port 3000');
});
