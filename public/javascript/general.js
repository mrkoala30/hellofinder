/* global $ */
$(document).ready(function(){

    var url = $('#url').attr('value');
    var type = $('#type').attr('value');

    $('#show_dowload').hide();

    $('#basicModal').on('hidden.bs.modal', function () {
        $('#show_dowload').hide();
        $('#youtube').attr('src',"");
        $('#transmission').attr('value',"");
    });


    //ver dialogo de descarga
    $('[id^=show_info]').click(function() {
        var link = $(this).attr('value');
        $('#basicModal').modal('show');
        //agregar para transmision
        $('#transmission').attr('value',link);

        $('#loading').show();

            $.ajax({
                url : url+'/torrent/findtorrent',
                type : 'POST',
                data: {
                    'link': link,
                    'type': type
                },
                dataType : 'json',
                load : function(xhr, status) {
                    console.log("start");
                },
                success : function(json) {
                    if(type=="newpct"){
                        $('#youtube').attr('src',json.youtube);
                        $('#youtube').attr('type',"text/html");
                        $('#youtube').attr('title',"YouTube video player");
                        $('#youtube').attr('width',"auto")
                        $('#youtube').attr('height',"auto");
                        $('#youtube').attr('frameborder',"0");
                        $('#youtube').attr('allowfullscreen',"");
                        $('#youtube').addClass( "youtube-player" );
                    }
                    $('#loading').hide();
                    $('#show_dowload').show();
                    $('#descarga').attr('onclick','location.href="'+json.name+'"');
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
        console.log("enviando a transmission");
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