const express = require('express');
const app = express();
const port = 2024;
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());

app.use('/login', express.static('static'));

app.get('/', function(req, res){
    res.send('Hello World!');
});

app.post('/login-creds', function(req, res){
    console.log(req.body['uname'], req.body['psw']);
    const {uname, psw} = req.body;
    if(uname == 'abc' && psw == '123'){
        const accessToken = jwt.sign({ username: uname}, 'secret123');
        res.json(accessToken);
    } else {
        res.send('Invalid Creds!');
    }
});

const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, accessTokenSecret, (err, user) => {
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

app.get('/protected-resource', authenticateJWT, function(res, req){
    //check for the bearer token
    res.send("You are viewing a protected UTL")
})

app.listen(port, ()=>{console.log(`App running at: http://127.0.0.1:${port}`)})

