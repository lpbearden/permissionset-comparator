exports.index = function(req, res, next) {
  res.render('index', { title: 'Express', stuff: 'loaded the page'});
}

exports.success = function(req, res, next) {
    res.render("index", { title: "Auth Success", stuff: "Oauth success with Salesforce" });
};