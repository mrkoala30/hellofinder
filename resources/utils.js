var express = require('express');
var request = require('request');
var cheerio = require('cheerio');
var config = require('../resources/config.js');


module.exports.getPage = function (page,callback) {
    request(page, function(error, response, body) {
        if(error) {
            console.log("Error: " + error);
        }
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


module.exports.getNewpct = function (link,callback) {
    var resultado = [];

    request(link, function(error, response, body) {
        if(error) {
            console.log("Error: " + error);
        }
        var $ = cheerio.load(body);

        $('#categoryTable').filter(function(){
            var data = $(this);
            var tabla = data.find( "tr" ).find("td").find("strong").find("a");
            if(tabla!=null){
                for (var i = 0; i < tabla.length; ++i) {
                    var titulo = tabla[i].attribs.title.slice(21,tabla[i].attribs.title.length);
                    var temporada = null;
                    var calidad = null;
                    var name = null;
                    var capitulo = null;
                    var idioma = null;

                    if(titulo.search("-")!=-1) {
                        name = titulo.substring(0,titulo.indexOf("-"));
                    }else{
                        name = titulo.substring(0,30);
                    }
                    if(titulo.search("Espa")!=-1 || titulo.search("Spanish")!=-1){
                        idioma = "Español"
                    }else{
                        idioma = "English";
                    }

                    if(titulo.search("Cap.")!=-1) {
                        var num = titulo.search("Cap.")
                        capitulo = titulo.substring(num,num+7);
                    }


                    if(titulo.search("Temporada")!=-1){
                        var num = titulo.search("Temporada")
                        temporada = titulo.substring(num,num+11);
                    }
                    if(titulo.search("HDTV")!=-1){
                        var num = titulo.search("HDTV")
                        if(titulo.search("1080p")!=-1 || titulo.search("720p")!=-1){
                            if(titulo.search("720p")!=-1){
                                calidad = titulo.substring(num,num+9);
                            }else{
                                calidad = titulo.substring(num,num+10);
                            }
                        }else{
                            calidad = titulo.substring(num,num+4);
                        }
                    }
                    if(titulo.search("DVD")!=-1){
                        var num = titulo.search("DVD")
                        calidad = titulo.substring(num,num+6);
                    }
                    if(titulo.search("VO")!=-1){
                        var num = titulo.search("VO")
                        calidad = titulo.substring(num,num+3);
                    }
                    if(titulo.search("BluRay")!=-1){
                        var num = titulo.search("BluRay")
                        calidad = titulo.substring(num,num+15);
                    }

                    var result = {
                        enlace: tabla[i].attribs.href,
                        nombre: name,
                        capitulo: capitulo,
                        calidad: calidad,
                        idioma: idioma,
                        temporada: temporada
                    };
                    resultado.push(result);
                }
            }
        });

        callback(error,resultado);
    });

};


module.exports.getThePirateBay = function (proxy,link,callback) {
    var resultado = [];
    request(link, function(error, response, body) {
        if(error){
            console.error(error);
        }
        var $ = cheerio.load(body);
        $('#searchResult').filter(function(){
            var data = $(this);
            var tabla = data.find($('.detName'));
            if(tabla!=null){
                var title = "";
                var enlace = "";
                for (var i = 0; i < tabla.length; ++i) {
                    if (typeof tabla[i].children[1] != "undefined") {
                        enlace = title = tabla[i].children[1].attribs.href;
                        title = tabla[i].children[1].children[0].data;
                    }
                    var result = {
                        nombre: title,
                        enlace: proxy+enlace
                    };
                    resultado.push(result);
                }
            }
        });
        callback(error,resultado);
    });

};

module.exports.getMejorTorrent = function (link,callback) {

    var resultado = [];
    request(link, function(error, response, body) {
        if(error){
            console.error(error);
        }

        var $ = cheerio.load(body);

        $('#categoryTable').filter(function(){


        });

        callback(error,resultado);

    });

};

module.exports.getPrincipalNew = function (page,callback) {
    request(page, function(error, response, body) {
        if(error) {
            console.log("Error: " + error);
        }
        var categories = [];
        var $ = cheerio.load(body);

        $('#categoryEstrenosCine').filter(function(){
            var peliculas = [];
            var data = $(this);
            var dat =  data.find("ul").find("a");
            for(var i = 0; i < dat.length; ++i){
                var item = dat[i];
                var img = item.children[1].children[1].attribs.src;
                var title = item.children[1].children[3].children[1].children[0].data;
                var bean = {
                    type: "Estrenos",
                    title: title,
                    url: item.attribs.href,
                    img: img
                }
                peliculas.push(bean);
            }
            categories.push(peliculas);
        });

        $('#categoryPeliculasCastellano').filter(function(){
            var peliculas = [];
            var data = $(this);
            var dat =  data.find("ul").find("a");
            for(var i = 0; i < dat.length; ++i) {
                var item = dat[i];
                var img = item.children[1].children[1].attribs.src;
                var title = item.children[1].children[3].children[1].children[0].data;
                var bean = {
                    type: "Peliculas Castellano",
                    title: title,
                    url: item.attribs.href,
                    img: img
                }
                peliculas.push(bean);
            }
            categories.push(peliculas);
        });



        $('#categorySeriesHD').filter(function(){
            var peliculas = [];
            var data = $(this);
            var dat =  data.find("ul").find("a");
            for(var i = 0; i < dat.length; ++i){
                var item = dat[i];
                var img = item.children[1].children[1].attribs.src;
                var title = item.children[1].children[3].children[1].children[0].data;
                var bean = {
                    type: "Series HD",
                    title: title,
                    url: item.attribs.href,
                    img: img
                }
                peliculas.push(bean);
            }
            categories.push(peliculas);
        });

        $('#categorySeriesVO').filter(function(){
            var peliculas = [];
            var data = $(this);
            var dat =  data.find("ul").find("a");
            for(var i = 0; i < dat.length; ++i){
                var item = dat[i];
                var img = item.children[1].children[1].attribs.src;
                var title = item.children[1].children[3].children[1].children[0].data;
                var bean = {
                    type: "Series VO",
                    title: title,
                    url: item.attribs.href,
                    img: img
                }
                peliculas.push(bean);
            }
            categories.push(peliculas);
        });

        $('#categoryPeliculasHD').filter(function(){
            var peliculas = [];
            var data = $(this);
            var dat =  data.find("ul").find("a");
            for(var i = 0; i < dat.length; ++i){
                var item = dat[i];
                var img = item.children[1].children[1].attribs.src;
                var title = item.children[1].children[3].children[1].children[0].data;
                var bean = {
                    type: "Peliculas HD",
                    title: title,
                    url: item.attribs.href,
                    img: img
                }
                peliculas.push(bean);
            }
            categories.push(peliculas);
        });

        $('#categorySeriesCastellano').filter(function(){
            var peliculas = [];
            var data = $(this);
            var dat =  data.find("ul").find("a");
            for(var i = 0; i < dat.length; ++i){
                var item = dat[i];
                var img = item.children[1].children[1].attribs.src;
                var title = item.children[1].children[3].children[1].children[0].data;
                var bean = {
                    type: "Series Castellano",
                    title: title,
                    url: item.attribs.href,
                    img: img
                }
                peliculas.push(bean);
            }
            categories.push(peliculas);
        });

        callback(null,categories);
    });
};




var replaceAll = function( text, busca, reemplaza ){
    while (text.toString().indexOf(busca) != -1)
        text = text.toString().replace(busca,reemplaza);
    return text;
};
