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
                  //console.log(resultado);
              }
             }
         });
           res.render('buscar',{url:config.url.dir,result:resultado,
                                scripts:[config.url.dir+'/plugins/datatables/jquery.dataTables.min.js',
                                         config.url.dir+'/plugins/datatables/jquery-dateFormat.min.js',
                                         config.url.dir+'/javascript/table_data.js'],
                                styles:[config.url.dir+'/plugins/datatables/dataTables.bootstrap.css',
                                    config.url.dir+'/plugins/datatables/jquery.dataTables_themeroller.css']
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
                    nombre: tabla[i].attribs.title.slice(21,tabla[i].attribs.title.length)
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
