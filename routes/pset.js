const jsforce = require("jsforce");

exports.list = function(req, res) {
  let oauth2 = req.app.get("oauth2");
  if (!req.session.accessToken || !req.session.instanceUrl) { res.redirect('/'); }


    //instantiate connection with the req items
    let conn = new jsforce.Connection({
        oauth2: { oauth2 },
        accessToken: req.session.accessToken,
        instanceUrl: req.session.instanceUrl
    });

    let permSets = ['GRS_Core_Permissions', 'Developer'];
    conn.metadata.read('PermissionSet', permSets, function(err, metadata) {
        if (err) { console.error(err); }
        for (var i = 0; i < metadata.length; i++) {
            console.log('meta length is: ' + metadata.length);
            var meta = metadata[i];
            console.log("Full Name: " + meta.fullName);
        }
    });

    res.render('index', { title : 'Permission Sets', stuff : 'loaded two permission sets ' + permSets[0] + ' and ' + permSets[1] });
};