var express = require('express');
var request = require('request');
var cheerio = require('cheerio');
var config = require('../resources/config.js');
var http = require('http');
var fs = require('fs');
var transmission = require ('transmission');
var router = express.Router();

transmission = new transmission({
    port: 9091,         // DEFAULT : 9091
    host: "adchome.duckdns.org",         // DEAFULT : 127.0.0.1
    username: config.transmision.user,   // DEFAULT : BLANK
    password: config.transmision.pass    // DEFAULT : BLANK
});
var torrent = "";
var types = "";

router.post('/findtorrent',function(req,res){
    var link = req.body.link;
    types = req.body.type;
    var trailer = "";
    request(link, function(error, response, body) {
        if(error) {
            console.log("Error: " + error);
        }
        var $ = cheerio.load(body);

        if(typeof types=="undefined" || types=="newpct"){
            $('.external-url').filter(function(){
                var data = $(this);
                torrent = data[0].attribs.href;
            });

            $('#content-trailer').filter(function(){
                var data = $(this);
                if (typeof data[0].children[1].children[1].children[1].children[3] != "undefined") {
                    trailer = data[0].children[1].children[1].children[1].children[3].attribs.src;
                }
            });

            res.send({name:torrent,youtube:trailer
            });
        }else if(types=="thepiratebay"){

            $('.download').filter(function(){
                var data = $(this);
                torrent = data[0].children[1].attribs.href;
            });
            res.send({name:torrent,youtube:trailer
            });
        }

    });

});

router.post('/descargar',function(req,res){

    if(typeof types=="undefined" || types=="newpct"){
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
                res.send({url:config.url.dir,name:torrent,succes:"Descargando"
                });
            });
        });
    }else if(types=="thepiratebay"){
        transmission.addUrl(torrent, function(err, arg){
            if(err){
                console.log(err);
            }else{
                console.log(arg.id);
                res.send({url:config.url.dir,name:torrent,succes:"Añadido a Transmission"
                });
            }
        });


    }

});

var replaceAll = function( text, busca, reemplaza ){
        while (text.toString().indexOf(busca) != -1)
            text = text.toString().replace(busca,reemplaza);
        return text;
    };

module.exports = router;
