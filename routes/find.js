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

router.get('/cine-alta-definicion-hd', function(req, res) {
    var page = "http://www.newpct.com/cine-alta-definicion-hd/";
    utils.getPage(page,function(err,response){
        if(err){
            console.log(err);
        }else{
            res.render('find',{url:config.url.dir,pelis: response
            });
        }
    });
});

router.get('/peliculas-rip', function(req, res) {
    var page = "http://www.newpct.com/peliculas-castellano/peliculas-rip/";
    utils.getPage(page,function(err,response){
        if(err){
            console.log(err);
        }else{
            res.render('find',{url:config.url.dir,pelis: response
            });
        }
    });
});

router.get('/peliculas-en-3d-hd', function(req, res) {
    var page = "http://www.newpct.com/peliculas-en-3d-hd/";
    utils.getPage(page,function(err,response){
        if(err){
            console.log(err);
        }else{
            res.render('find',{url:config.url.dir,pelis: response
            });
        }
    });
});

router.get('/peliculas-vo', function(req, res) {
    var page = "http://www.newpct.com/peliculas-vo/";
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
