var express = require('express');
var router = express.Router();
var utils = require('../resources/utils.js');

//get Peliculas Estrenos
router.get('/', function(req, res, next) {
    var page = "http://www.newpct.com/peliculas-castellano/estrenos-de-cine/";
    utils.getPage(page,function(err,response){
        if(err){
          console.log(err);
        }else{
            res.render('find',{pelis: response
            });
        }
    });
});
module.exports = router;
