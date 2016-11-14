var express = require('express');
var router = express.Router();
var utils = require('../resources/utils.js');
var config = require('../resources/config.js');

//get Peliculas Estrenos
router.get('/', function(req, res) {
    var page = "http://www.newpct.com/peliculas-castellano/estrenos-de-cine/";
    utils.getPage(page,function(err,response){
        if(err){
          console.log(err);
        }else{
            res.render('find',{url:config.url.dir,pelis: response
            });
        }
    });
});
module.exports = router;
