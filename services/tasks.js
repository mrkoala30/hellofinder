var express = require('express');
var request = require('request');
var cheerio = require('cheerio');
var config = require('../resources/config.js');
var CronJob = require('cron').CronJob;
var fs = require('fs');
var utils = require('../resources/utils.js');
var transmission = require ('transmission');

//Create connection whit Telegram bot
var TelegramBot = require('node-telegram-bot-api');
var token = '265164835:AAEv-6T23U420Hl6SbqRdA18RROoM8uVFEs';
var bot = new TelegramBot(token, {polling: true});
var chatid = 210998720;

transmission = new transmission({
    port: 9091,         // DEFAULT : 9091
    host: "adchome.duckdns.org",         // DEAFULT : 127.0.0.1
    username: 'transmission',   // DEFAULT : BLANK
    password: 'transmission'    // DEFAULT : BLANK
});


module.exports.updateMovies = function () {
    var page =  "http://www.newpct.com/peliculas-castellano/estrenos-de-cine/";
    var file = "last_movie.txt";
    update(page,file);
};

module.exports.updateSeries = function () {
    var page = "http://www.newpct.com/series-alta-definicion-hd/"
    var file = "last_serie.txt";
    var series = "auto_dowload.json";

    update(page,file,function (data) {
       if(data!=null){
           //leer fichero con series que quiero descargar
           fs.readFile(series, 'utf8', function (err,res) {
             var result = JSON.parse(res);
               for(k in data){
                   for(u in result.series){
                       if(data[k].titulo==result.series[u].name){
                           console.log("Descargando serie: "+ data[k].titulo);
                          // var file = fs.createWriteStream("./public/serie_auto.torrent");
                           var torrent = "";
                           /*
                           request(data[k].enlace, function(error, response, body) {
                               if(error) {
                                   console.log("Error: " + error);
                               }
                               // console.log("Status code: " + response.statusCode);
                               var $ = cheerio.load(body);

                               $('.external-url').filter(function(){
                                   var data = $(this);
                                   torrent = data[0].attribs.href;
                               });

                               var torrentfinal =torrent.slice(torrent.search("link=")+5,torrent.length);
                               var ulr = "http://www.newpct.com/" + torrentfinal;
                               var stream = request(ulr).pipe(file);
                               stream.on('finish', function () {
                                   transmission.addFile('./public/serie_auto.torrent', function(err, arg){
                                       if(err)
                                           console.log(err);
                                       console.log(arg)
                                   });
                               });
                           });*/

                       }
                   }
               }
           });
       }
    });
};


var update = function(page,file,callback){
    var nuevo = [];
    new CronJob('0 * * * * *', function() {
        utils.getPage(page,function (err,response) {
            var peliculas = response;
            var posi = 0;
            fs.readFile(file, 'utf8', function (err,data) {
                if (err) {
                    return console.log(err);
                }
                if(data!=peliculas[0].enlace){
                    //se ha actualizado
                    for(k in peliculas){
                        if(data==peliculas[k].enlace){
                            for(var u = 1;u<k;u++){
                                nuevo.push(peliculas[k]);
                               // bot.sendPhoto(chatid,peliculas[k].img, {caption:"Titulo: "+peliculas[k].titulo+" \n Calidad: "+peliculas[k].calidad+" \n Enlace: "+peliculas[k].enlace});
                            }
                        }
                    }
                    nuevo.push(peliculas[0]);
                    //bot.sendPhoto(chatid,peliculas[0].img, {caption:"Titulo: "+peliculas[0].titulo+"\n Calidad: "+peliculas[0].calidad +"\n Enlace: "+peliculas[0].enlace});
                    fs.writeFile(file, peliculas[0].enlace,function (err) {
                    });
                }
                if (callback) {
                    callback(nuevo);
                }
            });
        });
       // console.log('Check Update Newpct.com');
    }, null, true, 'Europe/Madrid');
};


