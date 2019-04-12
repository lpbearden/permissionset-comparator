// Set env and get env config
const env = 'development';
const config = require('./config')[env];

// Dependencies
const express = require('express');
const path = require('path');
const jsforce = require('jsforce');
const session = require('express-session');

// Require route files
const site = require('./routes/site');
const auth = require("./routes/auth");
const pset = require("./routes/pset");

// Setup HTTP Server
const app = express();

//initialize session
app.use(session({ secret: 'S3CRE7', resave: true, saveUninitialized: true }));

// Oauth Salesforce Connection
let oauth2 = new jsforce.OAuth2({
    loginUrl: config.url,
    clientId: config.key.clientId,
    clientSecret: config.key.clientSecret,
    redirectUri: 'http://localhost:3030/oauth2/callback'
});

app.set('oauth2', oauth2);


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// General / Index route
app.get('/', site.index);


// Auth routes
app.get('/oauth2/auth', auth.auth);
app.get('/oauth2/callback', auth.callback);

// Permission Set Routes
app.get('/permissionsets', pset.list);

module.exports = app;