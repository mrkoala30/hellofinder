var express = require('express');
var config = require('../resources/config.js');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.redirect('/find/start');
  //res.render('index', { url:config.url.dir,title: 'HelloFinder' });
});



module.exports = router;
