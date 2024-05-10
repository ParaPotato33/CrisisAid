const express = require('express');
const http = require('http');
const fs = require('fs');
const app = express();
const cors = require('cors');
const path = require('path');

app.use(cors());

/* var port = process.env.PORT || 8080,
    http = require('http'),
    fs = require('fs'),
    html = fs.readFileSync('index.html');

var log = function(entry) {
    fs.appendFileSync('/tmp/sample-app.log', new Date().toISOString() + ' - ' + entry + '\n');
    
}; */

var server = http.createServer(function (req, res) {
    if (req.method === 'POST') {
        var body = '';

        req.on('data', function(chunk) {
            body += chunk;
        });

        req.on('end', function() {
            if (req.url === '/') {
                console.log('Received message: ' + body);
            } else if (req.url == '/scheduled') {
                console.log('Received task ' + req.headers['x-aws-sqsd-taskname'] + ' scheduled at ' + req.headers['x-aws-sqsd-scheduled-at']);
            } 
            res.writeHead(200, 'OK', {'Content-Type': 'text/plain'});
            res.end();
        });
    }
    else if (req.method === 'PUT') {
        console.log("put request")
        var body = '';

        req.on('data', function(chunk) {
            body += chunk;
        });
        
        req.on('end', function() {
            if (req.url === '/tableData.json') {
                fs.writeFile('tableData.json', body, (err) => {
                    if (err) {
                        console.log(err);
                    }
                });
            }
            res.writeHead(200, 'OK', {'Content-Type': 'text/plain'});
            res.end();
        });
    }
    
    else if (req.url === '/') {
        fs.readFile('src/index.html', (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal server error');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(data);
            }
        });
    }
    else if (req.url === '/dashboard.html') {
        fs.readFile('src/dashboard.html', (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal server error');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(data);
            }
        });
    }
    else if (req.url === '/src/style.css') {
        fs.readFile('src/style.css', (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error');
            }
            else {
                res.writeHead(200, { 'Content-Type': 'text/css' });
                res.end(data);
            }
        });
    }
    else if (req.url === '/Assets/favicon.ico') {
        fs.readFile('Assets/favicon.ico', (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error');
            }
            else {
                res.writeHead(200, { 'Content-Type': 'image/x-icon' });
                res.end(data);
            }
        });
    }
    else if (req.url === '/Assets/CRISISAID.png') {
        fs.readFile("Assets/CRISISAID.png", (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error');
            }
            else {
                res.writeHead(200, { 'Content-Type': 'image/png' });
                res.end(data);
            }
        });
    }
    else if (req.url === '/Assets/EmergencyButton.png') {
        fs.readFile("Assets/EmergencyButton.png", (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error');
            }
            else {
                res.writeHead(200, { 'Content-Type': 'image/png' });
                res.end(data);
            }
        });
    }
    else if (req.url === '/src/emergency.js') {
        fs.readFile('src/emergency.js', (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error');
            } else {
                res.writeHead(200, { 'Content-Type': 'application/javascript' });
                res.end(data);
            }
        });
    }

    else if (req.url === '/src/script.js') {
        fs.readFile('src/script.js', (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error');
            } else {
                res.writeHead(200, { 'Content-Type': 'application/javascript' });
                res.end(data);
            }
        });
    }
    else if (req.url === '/tableData.json') {
        fs.readFile('tableData.json', (err, data) => {
            if (err) {
                console.log(JSON.parse(err));
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error');
            } else {
                
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(data);
            }
        });
        
    } else {
        console.log(req.url + ' not found');
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Not found');
    }
});

// Listen on port 3000, IP defaults to 127.0.0.1
server.listen(3000);

// Put a friendly message on the terminal
console.log('Server running at http://localhost:3000/');


    /* fs.writeFile('tableData.json', JSON.stringify(json), (err) => {
        if (err) {
            console.log(err);
        }
    }); */