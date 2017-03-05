var express = require('express');
var request = require('request');
var cheerio = require('cheerio');
var utils = require('../resources/utils.js');
var config = require('../resources/config.js');
//ar fs = require('fs');
var sync_request = require('sync-request');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res) {
    res.render('buscar',{page_name:"Buscar",url:config.url.dir
    });
});

router.post('/buscar',function(req,res){
        var name = req.body.title;
        var finder = req.body.select_finder;
        var link = "";

        if(finder == "newpct"){
            link = "http://www.newpct.com/buscar-descargas/"+name;
            utils.getNewpct(link,function(err,resultado){
                if(err){
                    console.log(err);
                }else{
                    res.render('buscar',{page_name:"Buscar",type:finder,url:config.url.dir,result:resultado,
                        scripts:[config.url.dir+'/plugins/datatables/jquery.dataTables.min.js',
                            config.url.dir+'/plugins/datatables/jquery-dateFormat.min.js',
                            config.url.dir+'/javascript/table_data.js'],
                        styles:[config.url.dir+'/plugins/datatables/dataTables.bootstrap.css',
                            config.url.dir+'/plugins/datatables/jquery.dataTables_themeroller.css']
                    });
                }
            });
        }

        if(finder == "mejortorrent"){
            res.render('buscar',{page_name:"Buscar",type:finder,url:config.url.dir,result:resultado,
                scripts:[config.url.dir+'/plugins/datatables/jquery.dataTables.min.js',
                    config.url.dir+'/plugins/datatables/jquery-dateFormat.min.js',
                    config.url.dir+'/javascript/table_data.js'],
                styles:[config.url.dir+'/plugins/datatables/dataTables.bootstrap.css',
                    config.url.dir+'/plugins/datatables/jquery.dataTables_themeroller.css']
            });
        }

        if(finder == "thepiratebay"){
            var proxy = "https://ukpirateproxy.xyz";
            link = proxy + "/s/?q="+name+"&page=0&orderby=99";

            utils.getThePirateBay(proxy,link,function(err,resultado){
                if(err){
                    console.log(err);
                }else{
                    res.render('buscar',{page_name:"Buscar",type:finder, url:config.url.dir,result:resultado,
                        scripts:[config.url.dir+'/plugins/datatables/jquery.dataTables.min.js',
                            config.url.dir+'/plugins/datatables/jquery-dateFormat.min.js',
                            config.url.dir+'/javascript/table_data.js'],
                        styles:[config.url.dir+'/plugins/datatables/dataTables.bootstrap.css',
                            config.url.dir+'/plugins/datatables/jquery.dataTables_themeroller.css']
                    });
                }
            });
        }
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
         res.render('buscar',{page_name:"Buscar",url:config.url.dir,descarga:linkse});
    });
       
});

module.exports = router;
