const express = require('express');
const app = module.exports = express();
const bodyParser = require('body-parser');
const REDIS_URL = process.env.REDIS_URL || 'redis://h:p1e4f069249d5210e03cadcccbd4143cb229fef9a7072655e63b91f019fa0804c@ec2-54-82-94-125.compute-1.amazonaws.com:35769';
const redis = require('redis').createClient(REDIS_URL);


const DICT = {};


const basicAuth = require('basic-auth-connect');
var username = null;

app.use(basicAuth(function (user, pass) {
    username = user;
    return ('angielski' === user || user === 'milosz') && 'slowka' === pass;
}));


app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/view'));
app.use(bodyParser.json());

// views is directory for all template files
app.set('views', __dirname + '/view');
app.set('view engine', 'ejs');

// routes
app.get('/', function (request, response) {
    response.render('index');
});

app.get('/dict', function (req, res) {
    res.setHeader('Content-Type', 'application/javascript');
    const name = "@" + username;

    if (DICT[name] !== undefined)
        return res.send(DICT[name]);

    redis.get("@" + username, function (err, reply) {
        DICT[name] = reply;
        res.send(reply);
    });

});


// start the app
app.listen(app.get('port'), function () {
    console.log('Node app is running on port', app.get('port'));
});
