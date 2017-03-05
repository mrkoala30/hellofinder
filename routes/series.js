var express = require('express');
var router = express.Router();
var config = require('../resources/config.js');
var utils = require('../resources/utils.js');

//get Series Estrenos
router.get('/', function(req, res) {
    var page = "http://www.newpct.com/series-alta-definicion-hd/";
    utils.getPage(page,function(err,response){
        if(err){
          console.log(err);
        }else{
            res.render('find',{page_name:"Series Español HD",url:config.url.dir,pelis: response
            });
        }
    });
});
module.exports = router;
