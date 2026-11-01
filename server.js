
const http = require('http');

// Create an HTTP server
const server = http.createServer((req, res) => {

    res.writeHead(200, {
        'Content-Type': 'text/plain'
    });

    res.end('Hello! Welcome to my Node.js server.');
});

// Start the server
server.listen(3000, () => {
    console.log('Server running on port 3000');
});
