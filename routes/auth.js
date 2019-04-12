const jsforce = require("jsforce");

exports.auth = function(req, res){
  console.log('in route');
  let oauth2 = req.app.get('oauth2');
  res.redirect(oauth2.getAuthorizationUrl({ scope: "api web refresh_token" }));
};

exports.callback = function(req, res) {
  let oauth2 = req.app.get("oauth2");
  var conn = new jsforce.Connection({ oauth2: oauth2 });
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

        res.redirect('/permissionsets');
    });
}