const http = require('http');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
require('dotenv').config();
const port = 4000;



const server = http.createServer(async (req, res) => {
    const url = req.url;
    const api_key= process.env.WEATHER_APP_API_KEY;
    if (url.startsWith('/weather')) {
        const query = new URLSearchParams(url.split('?')[1]);
        const city = query.get('city') || 'London'; 
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api_key}`;

        try {
            const response = await axios.get(weatherUrl);
            console.log("res",response.data);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(response.data));
        } catch (error) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Error fetching weather data');
        }
    } else if (url === '/' || url === '/index.html') {
        fs.readFile(path.join(__dirname, 'public', 'index.html'), (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Error loading index.html');
                return;
            }
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        });
    } else if (url.endsWith('.css')) {
        fs.readFile(path.join(__dirname, 'public', url), (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Error loading CSS');
                return;
            }
            res.writeHead(200, { 'Content-Type': 'text/css' });
            res.end(data);
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
