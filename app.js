const httpClient = require('request');
const express = require('express');
const path = require('path');
const jsforce = require('jsforce');
const session = require('express-session');
const bodyParser = require('body-parser');

var indexRouter = require('./routes/index');
// var tokenRouter = require('./routes/token');

// Setup HTTP Server
const app = express();

// Oauth Salesforce Connection
// const oauth2 = new jsforce.OAuth2({
//     loginUrl: 'https://test.salesforce.com',
//     clientId : 'CLIENT_ID',
//     clientSecret : 'CLIENT_SECRET',
//     redirectUri : 'http://localhost:3030/token'
// });


//initialize session
app.use(session({ secret: 'S3CRE7', resave: true, saveUninitialized: true }));


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


// app.get('/oauth2/auth', function(req, res) {
//     res.redirect(oauth2.getAuthorizationUrl({ scope: 'api web refresh_token' }));
// });


// app.get('/token', function(req, res) {
//     const conn = new jsforce.Connection({oauth2 : oauth2});
//     const code = req.query.code;
//     conn.authorize(code, function(err, userInfo) {
//         if (err) {return console.error('This error is in the auth callback: ' + err);}

//         console.log('Access Token: ' + conn.accessToken);
//         console.log('Instance URL: ' + conn.instanceUrl);
//         console.log('refreshToken: ' + conn.refreshToken);
//         console.log('User ID: ' + userInfo.id);
//         console.log('Org ID: ' + userInfo.organizationId);

//         req.session.accessToken = conn.accessToken;
//         req.session.instanceUrl = conn.instanceUrl;
//         req.session.refreshToken = conn.refreshToken;

//     var string = encodeURIComponent('true');
//        /* res.redirect('http://localhost:3000/?valid=' + string);*/
//     });

// });

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

module.exports = app;