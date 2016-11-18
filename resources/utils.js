var express = require('express');
var request = require('request');
var cheerio = require('cheerio');
var config = require('../resources/config.js');


module.exports.getPage = function (page,callback) {
    request(page, function(error, response, body) {
        if(error) {
            console.log("Error: " + error);
        }
        //console.log("Status code: " + response.statusCode);
        var $ = cheerio.load(body);

        $('#content-category').filter(function(){
            var peliculas = [];
            var data = $(this);
            // var ul = document.getElementById("foo");
            var li = data.find( "li" );
            //    console.log(li[0].children[1].children[1].children[3].children[3].children[0].data)
            for (var i = 0; i < li.length; ++i) {
                var calidad = "";
                var tamano = "";
                var capitulo = "";
                var pelicula = null;
                for(var u = 0;u<7; u=u+2){
                    var text = li[i].children[1].children[1].children[3].children[3].children[u].data;

                    if(text.search("Calidad:")!=-1){
                        calidad = text.slice(text.search("Calidad:")+8,text.length);
                    }
                    if(text.search("Temp")!=-1){
                        capitulo = text.slice(text.search("Temp"),text.length);
                    }
                    if(text.search("ño:")!=-1){
                        tamano = text.slice(text.search("ño:")+3,text.length);
                    }
                }
                var name = li[i].children[1].children[1].children[3].children[1].children[0].data;
               // if(name.length>23){
                 //   name = name.slice(0,19);
                //}
                if(capitulo == ""){
                    pelicula = {
                        titulo: name,
                        img : li[i].children[1].children[1].children[1].attribs.src,
                        enlace : li[i].children[1].attribs.href,
                        calidad: calidad,
                        tamano: tamano,
                        torrent: " "
                    };
                }else{
                    pelicula = {
                        titulo: name,
                        capitulo: capitulo,
                        img : li[i].children[1].children[1].children[1].attribs.src,
                        enlace : li[i].children[1].attribs.href,
                        calidad: calidad,
                        tamano: tamano,
                        torrent: " "
                    };
                }
                if(pelicula!=null){
                    peliculas.push(pelicula);
                }

            }
            callback(null,peliculas);

        });

    });
};

var replaceAll = function( text, busca, reemplaza ){
    while (text.toString().indexOf(busca) != -1)
        text = text.toString().replace(busca,reemplaza);
    return text;
};
