const server = require('./server');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

server.get('/', (req, res) => {
    res.send('Hello from server!')
})

server.post('/api/register', (req, res) => {

});

server.post('/api/login', (req, res) => {

});

server.get('/api/users', (req, res) => {

});

server.listen(5000, () => {
    console.log(' \n *** Listening on port 5000 *** \n')
})