const env = 'development';
const config = require('./config')[env];

const httpClient = require('request');
const express = require('express');
const path = require('path');
const jsforce = require('jsforce');
const session = require('express-session');
const bodyParser = require('body-parser');

var indexRouter = require('./routes/index');
//var authRouter = require('./routes/auth');

// Setup HTTP Server
const app = express();

//initialize session
app.use(session({ secret: 'S3CRE7', resave: true, saveUninitialized: true }));

// // Oauth Salesforce Connection
let oauth2 = new jsforce.OAuth2({
    loginUrl: config.url,
    clientId: config.key.clientId,
    clientSecret: config.key.clientSecret,
    redirectUri: 'http://localhost:3030/oauth2/callback'
});

// Login via Username + Password + Security Key
// app.get('/login', function(req, rest) {
//     var conn = new jsforce.Connection({});
//     conn.login('username', 'password', function(err, userInfo) {
//         if (err) { return console.error(err); }
//         console.log(conn.accessToken);
//         console.log(conn.instanceUrl);
//         console.log("User ID: " + userInfo.id);
//         console.log("Org ID: " + userInfo.organizationId);
//     });
// });

//bodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use('/', indexRouter);

app.get('/oauth2/auth', function(req, res) {
    res.redirect(oauth2.getAuthorizationUrl({ scope: 'api web refresh_token' }));
});


app.get('/oauth2/callback', function(req, res) {
    var conn = new jsforce.Connection({ oauth2 : oauth2 });
    var code = req.query.code;
    conn.authorize(code, function(err, userInfo) {
        if (err) { return console.error(err); }
        
        console.log(conn.accessToken);
        console.log(conn.refreshToken);
        console.log(conn.instanceUrl);
        console.log("User ID: " + userInfo.id);
        console.log("Org ID: " + userInfo.organizationId);

        req.session.accessToken = conn.accessToken;
        req.session.instanceUrl = conn.instanceUrl;
        req.session.refreshToken = conn.refreshToken;
        oauth2.refreshToken

        //var string = encodeURIComponent('true');
        res.redirect('/api/permissionsets');
    });
});


app.get('/api/permissionsets', function(req, res) {
    if (!req.session.accessToken || !req.session.instanceUrl) { res.redirect('/'); }


    //instantiate connection
    let conn = new jsforce.Connection({
        oauth2: { oauth2 },
        accessToken: req.session.accessToken,
        instanceUrl: req.session.instanceUrl
    });

    let types = [{type: 'PermissionSet', folder: null}];
    let meta = conn.metadata.list(types, '43.0', function(err, metadata) {
      if (err) { return console.error('err', err); }
        metadata.forEach(function(element) {
            console.log(element.fullName);
        });
    });

    // meta.then(function(result) {
    //     console.log(result.fullName);
    // })

});


app.get('/api/accounts', function(req, res) {
    
    // if auth has not been set, redirect to index
    if (!req.session.accessToken || !req.session.instanceUrl) { res.redirect('/'); }
    
    //SOQL query
    let q = 'SELECT Id, Name FROM Account LIMIT 10';
    
    //instantiate connection
    let conn = new jsforce.Connection({
        oauth2: { oauth2 },
        accessToken: req.session.accessToken,
        instanceUrl: req.session.instanceUrl
    });

    //set records array
    let records = [];
    let query = conn.query(q)
        .on("record", function(record) {
            records.push(record);
        })
        .on("end", function() {
            console.log("total in database : " + query.totalSize);
            console.log("total fetched : " + query.totalFetched);
            res.json(records);
        })
        .on("error", function(err) {
            console.error(err);
        })
        .run({ autoFetch: true, maxFetch: 4000 });
});


module.exports = app;