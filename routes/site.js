exports.index = function(req, res, next) {
  res.render('index', { title: 'Express', stuff: 'loaded the page'});
}