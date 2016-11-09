var express = require('express');
var request = require('request');
var cheerio = require('cheerio');
var http = require('http');
var fs = require('fs');
var download = require('download-file');
var transmission = require ('transmission');
var router = express.Router();

transmission = new transmission({
    port: 9091,         // DEFAULT : 9091
    host: "adchome.duckdns.org",         // DEAFULT : 127.0.0.1
    username: 'transmission',   // DEFAULT : BLANK
    password: 'transmission'    // DEFAULT : BLANK
});
var torrent = "";


/* GET users listing. */
router.get('/:name', function(req, res, next) {
   
    var link = replaceAll(req.params.name,"*","/");

    request(link, function(error, response, body) {
            if(error) {
                    console.log("Error: " + error);
                }
            console.log("Status code: " + response.statusCode);
            var $ = cheerio.load(body);
                $('.external-url').filter(function(){
                    var data = $(this);
                
                        torrent = data[0].attribs.href;
                    
                    //peliculas[i].torrent = data[0].attribs.href;
                    //  console.log(data[0].attribs.href);
                });
             res.render('torrent',{name:torrent
                    });
            //res.download(torrent); 
            });
});

router.post('/descargar',function(req,res, next){

    var file = fs.createWriteStream("./public/torrent.torrent");

    var torrentfinal =torrent.slice(torrent.search("link=")+5,torrent.length);
    var ulr = "http://www.newpct.com/" + torrentfinal;

    var stream = request(ulr).pipe(file);
    stream.on('finish', function () {
        transmission.addFile('./public/torrent.torrent', function(err, arg){
            if(err){
                res.render('torrent',{name:torrent,error:"Error"
                });
            }
            res.render('torrent',{name:torrent,succes:"Descargando"
            });
            console.log(arg);
        });
    });
});

var replaceAll = function( text, busca, reemplaza ){
        while (text.toString().indexOf(busca) != -1)
            text = text.toString().replace(busca,reemplaza);
        return text;
    }

module.exports = router;
