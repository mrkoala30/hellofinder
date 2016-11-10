var express = require('express');
var request = require('request');
var cheerio = require('cheerio');
var config = require('../resources/config.js');
var CronJob = require('cron').CronJob;
var fs = require('fs');
var utils = require('../resources/utils.js');

//Create connection whit Telegram bot
var TelegramBot = require('node-telegram-bot-api');
var token = '265164835:AAEv-6T23U420Hl6SbqRdA18RROoM8uVFEs';
var bot = new TelegramBot(token, {polling: true});
var chatid = 210998720;


module.exports.updateMovies = function () {
    var page =  "http://www.newpct.com/peliculas-castellano/estrenos-de-cine/";
    var file = "last_movie.txt";
    update(page,file);
};

module.exports.updateSeries = function () {
    var page = "http://www.newpct.com/series-alta-definicion-hd/"
    var file = "last_serie.txt";
    update(page,file,function (data) {
       if(data!=null){
           //leer fichero con series que quiero descargar
           //.......
           for(k in data){
               if(data[k].titulo=="The Making of the M"){
                   console.log("Descargando serie: "+ data[k].titulo);
               }
           }

       }
    });
};


var update = function(page,file,callback){
    var nuevo = [];
    new CronJob('0 * * * * *', function() {
        utils.getPage(false,page,function (err,response) {
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
                                bot.sendPhoto(chatid,peliculas[k].img, {caption:"Titulo: "+peliculas[k].titulo+" \n Calidad: "+peliculas[k].calidad+" \n Enlace: "+peliculas[k].enlace});
                            }
                        }
                    }
                    nuevo.push(peliculas[0]);
                    bot.sendPhoto(chatid,peliculas[0].img, {caption:"Titulo: "+peliculas[0].titulo+"\n Calidad: "+peliculas[0].calidad +"\n Enlace: "+peliculas[0].enlace});
                    fs.writeFile(file, peliculas[0].enlace,function (err) {
                    });
                }
                if (callback) {
                    callback(nuevo);
                }
            });
        });
        console.log('Check Update Newpct.com');
    }, null, true, 'Europe/Madrid');
};


