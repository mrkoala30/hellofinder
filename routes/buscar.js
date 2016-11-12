var express = require('express');
var request = require('request');
var cheerio = require('cheerio');
var config = require('../resources/config.js');
//ar fs = require('fs');
var sync_request = require('sync-request');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res) {
    res.render('buscar',{url:config.url.dir
    });      
});

router.post('/buscar',function(req,res){
        var resultado = [];
        var name = req.body.title;
        //console.log(name);
        var link = "http://www.newpct.com/buscar-descargas/"+name;
        
        request(link, function(error, response, body) {
        if(error) {
                console.log("Error: " + error);
            }
        //console.log("Status code: " + response.statusCode);
        var $ = cheerio.load(body);
         $('#categoryTable').filter(function(){
             var data = $(this);
             var tabla = data.find( "tr" ).find("td").find("strong").find("a");
             if(tabla!=null){
                 for (var i = 0; i < tabla.length; ++i) {
                  var result = {
                    enlace: config.url.dir +"/"+ replaceAll(tabla[i].attribs.href,"/","*"),
                    nombre: tabla[i].attribs.title
                  };
                  resultado.push(result);
                  //console.log(resultado);
              }
             }
         });
           res.render('buscar',{url:config.url.dir,result:resultado
                    });
        });
});

router.post('/descargar', function(req, res) {
     var resultado = [];
        var name = req.body.title;
        var temporada = req.body.temporada;
        //console.log(name);
        var link = "http://www.newpct.com/buscar-descargas/"+name;
    request(link, function(error, response, body) {
        if(error) {
                console.log("Error: " + error);
            }
        //console.log("Status code: " + response.statusCode);

        var $ = cheerio.load(body);
          $('#categoryTable').filter(function(){
             var data = $(this);
             var tabla = data.find( "tr" ).find("td").find("strong").find("a");
             if(tabla!=null){
                 for (var i = 0; i < tabla.length; ++i) {
                  var result = {
                    enlace: tabla[i].attribs.href,
                    nombre: tabla[i].attribs.title
                  };
                  resultado.push(result);
                 // console.log(resultado);
              }
             }
         });
         //termina la busqueda cargar cada pagina y descargar
         var linkse = [];
         for(k in resultado){
                if(resultado[k].nombre.search("Temporada "+temporada)!=-1 && resultado[k].nombre.search("AC3")!=-1){
                    console.log(resultado[k].enlace);
                    var rest = sync_request('GET', resultado[k].enlace);
                    var $ = cheerio.load(rest.getBody());

                     $('.external-url').filter(function(){
                        var data = $(this);
                         //fs.appendFile('./public/output.json', data[0].attribs.href+"\n", function (err) {
//
  //                       });
                             linkse.push(data[0].attribs.href);
                     });
                } 
         }
         //console.log(linkse);
         res.render('buscar',{url:config.url.dir,descarga:linkse});
    });
       
});

var replaceAll = function( text, busca, reemplaza ){
        while (text.toString().indexOf(busca) != -1)
            text = text.toString().replace(busca,reemplaza);
        return text;
    };

module.exports = router;
