/* global $ */
$(document).ready(function(){

    var url = $('#url').attr('value');
    console.log(url);

    //ver dialogo de descarga
    $('[id^=show_info]').click(function() {
        var link = $(this).attr('value');
        $.ajax({
            url : url+'/torrent/findtorrent',
            type : 'POST',
            data: {
                'link': link
            },
            dataType : 'json',
            success : function(json) {
                $('#youtube').attr('src',json.youtube);
                $('#youtube').attr('type',"text/html");
                $('#youtube').attr('title',"YouTube video player");
                $('#youtube').attr('width',"570")
                $('#youtube').attr('height',"370");
                $('#youtube').attr('frameborder',"0");
                $('#youtube').attr('allowfullscreen',"");

                $('#youtube').addClass( "youtube-player" );


                $('<iframe>', {
                    class:"youtube-player",
                    type:"text/html",
                    src: json.youtube,
                    title: "YouTube video player",
                    id:  'youtube',
                    width:640,
                    height:390,
                    frameborder: 0
                }).appendTo('.accordion');

                $('#descarga').attr('href',json.name);

                $('#basicModal').modal('show');

            },
            error : function(xhr, status) {
               alert('Disculpe, existió un problema');
            },
            complete : function(xhr, status) {
                console.log('Petición realizada');
            }
        });
    });

    //agregar a transmision
    $('#transmission').click(function() {
        $.ajax({
            url : url+'/torrent/descargar',
            type : 'POST',
            dataType : 'json',
            success : function(json) {
                //console.log(json.succes);
                //$('#basicModal').modal('show');
            },
            error : function(xhr, status) {
                alert('Disculpe, existió un problema');
            },
            complete : function(xhr, status) {
                console.log('Petición realizada');
            }
        });
    });



});