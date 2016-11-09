var request = require('request');
var cheerio = require('cheerio');
var peliculas = [];

function Utils () {
    var torrent = "http://localhost:3000/torrent/";

    var replaceAll = function( text, busca, reemplaza ){
        while (text.toString().indexOf(busca) != -1)
            text = text.toString().replace(busca,reemplaza);
        return text;
    };
}

module.exports = Utils;
