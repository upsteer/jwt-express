const express = require('express');
const app = express();
const port = 2024;
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

app.use(bodyParser.json());

app.use('/login', express.static('static'));

app.get('/', function(req, res){
    res.send('Hello World!');
});

app.post('/authenticate', function(req, res){
    console.log(req.body['username'], req.body['password']);
    const {username, password} = req.body;
    if(username == 'abc' && password == '123'){
        const accessToken = jwt.sign({ username: username}, 'secret123');
        res.json(accessToken);
    } else {
        res.send('Invalid Creds!');
    }
});

const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];
        console.log(token)
        jwt.verify(token, 'secret123', (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }
            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401);
    }
};

app.get('/protected-resource', authenticateJWT, function(req, res){
    //check for the bearer token
    res.send("You are viewing a protected URL");
})

app.listen(port, ()=>{console.log(`App running at: http://127.0.0.1:${port}`)})

