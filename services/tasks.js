var express = require('express');
var request = require('request');
var cheerio = require('cheerio');
var config = require('../resources/config.js');
var CronJob = require('cron').CronJob;
var fs = require('fs');

//Create connection whit Telegram bot
var TelegramBot = require('node-telegram-bot-api');
var token = '265164835:AAEv-6T23U420Hl6SbqRdA18RROoM8uVFEs';
var bot = new TelegramBot(token, {polling: true});
var chatid = 210998720;








class Task {
    constructor(){
        var li = "";
        new CronJob('0 * * * * *', function() {
             var pelicula = {};
            request("http://www.newpct.com/peliculas-castellano/estrenos-de-cine/", function(error, response, body) {
                if(error) {
                    console.log("Error: " + error);
                }
                console.log("Status code: " + response.statusCode);
                var $ = cheerio.load(body);

                $('#content-category').filter(function(){

                    var data = $(this);
                    li = data.find( "li" );

                        var calidad = "";
                        var tamano = "";
                        for(var u = 0;u<7; u=u+2){
                                var text = li[0].children[1].children[1].children[3].children[3].children[u].data;
                                if(text.search("Calidad:")!=-1){
                                    calidad = text.slice(text.search("Calidad:")+8,text.length);
                                }
                                if(text.search("ño:")!=-1){
                                    tamano = text.slice(text.search("ño:")+3,text.length);
                                }
                        }
                        var name = li[0].children[1].children[1].children[3].children[1].children[0].data;
                        if(name.length>23){
                            name = name.slice(0,19);
                        }
                        pelicula = {
                            titulo: name,
                            img : li[0].children[1].children[1].children[1].attribs.src,
                            enlace :  li[0].children[1].attribs.href,
                            calidad: calidad,
                            tamano: tamano,
                            torrent: " "
                        };
                });
                //console.log(pelicula);
                var posi = 0;
                fs.readFile('last_movie.txt', 'utf8', function (err,data) {
                    if (err) {
                        return console.log(err);
                    }
                    if(data!=pelicula.enlace){
                        //se ha actualizado
                        for(var i = 1;i<5;i++){
                            if(data==li[i].children[1].attribs.href){
                              posi = i;
                            }
                        }
                        if(posi>1){ //2
                            for(var u = 1;u<posi;u++){
                                bot.sendPhoto(chatid,li[u].children[1].children[1].children[1].attribs.src, {caption:"Titulo: - \n Calidad: - \n Enlace: "+li[u].children[1].attribs.href});
                            }
                        }
                        bot.sendPhoto(chatid,pelicula.img, {caption:"Titulo: "+pelicula.titulo+"\n Calidad: "+pelicula.calidad +"\n Enlace: "+pelicula.enlace});
                        fs.writeFile('last_movie.txt', pelicula.enlace);
                    }
                });
            });
        console.log('Check Movie Update Newpct.com');
        }, null, true, 'America/Los_Angeles');
    }
}

module.exports = Task;






