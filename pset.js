const jsforce = require("jsforce");
const _ = require("lodash");

exports.list = function(req, res) {
    console.log("pset.list");
    let oauth2 = req.app.get("oauth2");
    if (!req.session.accessToken || !req.session.instanceUrl) {
        res.redirect("/");
    }

    //instantiate connection with the req items
    let conn = new jsforce.Connection({
        oauth2: { oauth2 },
        verions: "45.0",
        accessToken: req.session.accessToken,
        instanceUrl: req.session.instanceUrl
    });

    /**
     *  Code to read all permission sets in an org.
     **/
    let types = [{ type: "PermissionSet", folder: null }];
    conn.metadata.list(types, "45.0", function(err, metadata) {
        if (err) {
            return console.error("err", err);
        }
        metadata.forEach(function(element) {
            console.log(element.fullName);
        });
    });

    res.redirect("/");
    // res.render('index', { title : 'Permission Sets', stuff : 'loaded two permission sets ' + permSets[0] + ' and ' + permSets[1] });
};

exports.compare = function(req, res) {
    let oauth2 = req.app.get("oauth2");
    if (!req.session.accessToken || !req.session.instanceUrl) {
        res.redirect("/");
    }

    //instantiate connection with the req items
    let conn = new jsforce.Connection({
        oauth2: { oauth2 },
        accessToken: req.session.accessToken,
        instanceUrl: req.session.instanceUrl,
        version: "45.0"
    });

    let psets = ["Developer", "Developer2"];
    conn.metadata.read("PermissionSet", psets, psetCompare);
    res.redirect("/");
};

psetCompare = function(err, metadata) {
    let permSet1, permSet2;
    if (err) {console.error(err);}

    permSet1 = metadata[0];
    permSet2 = metadata[1];
    console.log('Permset 1: ' + permSet1.fullName);
    console.log('Permset 2: ' + permSet2.fullName);

    /*
        TODO:
            * Better comparator? Ignore false false from showing up as a difference and just show the permission that enables the value.
            * GUI to view
            * GUI to select permission sets
            * Output results to web browser
    */
    if(!_.isEqual(permSet1.userPermissions, permSet2.userPermissions)) {
        console.log('\n\nUser permissions are not equal.\n');

        let userDiff = _.differenceWith(permSet1.userPermissions, permSet2.userPermissions, _.isEqual);
        console.log('User permissions in ' + permSet1.fullName + ' not found in ' + permSet2.fullName);
        console.log(userDiff);

        let userDiff2 = _.differenceWith(permSet2.userPermissions, permSet1.userPermissions, _.isEqual);
        console.log('\nUser permissions in ' + permSet2.fullName + ' not found in ' + permSet1.fullName);
        console.log(userDiff2);
    } else {
        console.log('\n\nUser permissions are the same.\n');
    }

    if(!_.isEqual(permSet1.objectPermissions, permSet2.objectPermissions)) {
        console.log('\n\nObject permissions are not equal.\n');

        let objectDiff = _.differenceWith(permSet1.objectPermissions, permSet2.objectPermissions, _.isEqual);
        console.log('Object permissions in ' + permSet1.fullName + ' not found in ' + permSet2.fullName);
        console.log(objectDiff);

        let objectDiff2 = _.differenceWith(permSet2.objectPermissions, permSet1.objectPermissions, _.isEqual);
        console.log('\nObject permissions in ' + permSet2.fullName + ' not found in ' + permSet1.fullName);
        console.log(objectDiff2);
    } else {
        console.log('\n\nObject permissions are the same.\n');
    }

    if(!_.isEqual(permSet1.fieldPermissions, permSet2.fieldPermissions)) {
        console.log('\n\nField permissions are not equal.\n');

        let fieldDiff = _.differenceWith(permSet1.fieldPermissions, permSet2.fieldPermissions, _.isEqual);
        console.log('Field permissions in ' + permSet1.fullName + ' not found in ' + permSet2.fullName);
        console.log(fieldDiff);

        let fieldDiff2 = _.differenceWith(permSet2.fieldPermissions, permSet1.fieldPermissions, _.isEqual);
        console.log('\nField permissions in ' + permSet2.fullName + ' not found in ' + permSet1.fullName);
        console.log(fieldDiff2);
    } else {
        console.log('\n\nField permissions are the same.\n');
    }

};