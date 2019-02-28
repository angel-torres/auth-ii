const server = require('./server');
const db = require('./database/dbConfig.js');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

const secret = 'the secret is lame';

function generateToken(user) {
    const payload = {
        subject: user.username
    } 

    const options = {
        expiresIn: '1hr'
    }

    return jwt.sign(payload, secret, options)
}

server.get('/', (req, res) => {
    res.send('Hello from server!')
})

server.post('/api/register', (req, res) => {
    const user = req.body;

    if ( user.username && user.password ) {
        const token = generateToken(user.username)
        const hash = bcryptjs.hashSync(user.password, 12);
        user.password = hash;
        db('users').insert(user)
        .then(response => {
            res.status(200).json({user: user.username, token})
        })
    } else {
        res.status(400).json({message: 'Must provide username and password.'})
    }
});

server.post('/api/login', async (req, res) => {
    const {username, password} = req.body;
    if ( username && password) {
        try {
            const user = await db('users').where({username}).first();
            if ( user && bcryptjs.compareSync( password, user.password) ) {
                const token = generateToken(user);
                res.status(200).json({username, token})
            } else {
                res.status(400).json({message: "Invalid token."});
            }
        } catch (error) {
            res.status(500).json({message:'server error'})
        }
    } else {
        res.status(400).json({message:'Must provide username and password.'})
    }
});

function restricted(req, res, next) {
    const token = req.headers.authorization

    if (token) {
        jwt.verify( token, secret, (err, decodedtoken) => {
            if (err) {
                res.status(401).json({message:'Invalid token.'})
            } else {
                next()
            }
        } )
    } else {
        res.status(400).json({message:'Must provide token.'})
    }
}

server.get('/api/users', restricted, (req, res) => {
    db('users')
    .then(response => res.status(200).json(response))
    .catch(err => res.status(500).json({message:"please try again", err}))
});

server.listen(5000, () => {
    console.log(' \n *** Listening on port 5000 *** \n')
})