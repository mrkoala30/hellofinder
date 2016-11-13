/* global $ */
$(document).ready(function(){

    var url = $('#url').attr('value');
    $('#show_dowload').hide();

    $('#basicModal').on('hidden.bs.modal', function () {
        $('#show_dowload').hide();
        $('#youtube').attr('src',"");
    })

    //ver dialogo de descarga
    $('[id^=show_info]').click(function() {
        var link = $(this).attr('value');
        $('#basicModal').modal('show');

        $('#loading').show();

        $.ajax({
            url : url+'/torrent/findtorrent',
            type : 'POST',
            data: {
                'link': link
            },
            dataType : 'json',
            load : function(xhr, status) {
                console.log("start");
            },
            success : function(json) {
                $('#youtube').attr('src',json.youtube);
                $('#youtube').attr('type',"text/html");
                $('#youtube').attr('title',"YouTube video player");
                $('#youtube').attr('width',"auto")
                $('#youtube').attr('height',"auto");
                $('#youtube').attr('frameborder',"0");
                $('#youtube').attr('allowfullscreen',"");
                $('#youtube').addClass( "youtube-player" );

                $('#loading').hide();
                $('#show_dowload').show();
                $('#descarga').attr('href',json.name);
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