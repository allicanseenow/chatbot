
/*
 * GET home page.
 */

exports.index = function(req, res){
  // res.render(view);
  // view: the path to the file to be rendered. If path does not have an extension,
  // app.set('view engine', ) will decide it
  res.render('index', { title: 'Express' });
};

exports.chatRoom = function(req, res) {
  res.render('chatroom')
};

