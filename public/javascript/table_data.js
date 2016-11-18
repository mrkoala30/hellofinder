$(document).ready(function(){
    $('#example1').DataTable({
        bJQueryUI: true,
        bAutoWidth: false,
        iDisplayLength: 10,
        aoColumnDefs: [
            { "sWidth": "30%", "aTargets": [ 0 ],
                "bSortable": false, "aTargets": [ 0 ]
            }
        ],
        oLanguage: {
            "sProcessing":   "Procesando...",
            "sLengthMenu":   "Mostrar _MENU_mensajes",
            "sZeroRecords":  "No se encontraron mensajes",
            "sInfo":         "Resultado _START_ a _END_ de _TOTAL_ ",
            "sInfoEmpty":    "No hay resultados",
            "sInfoFiltered": "(_MAX_ total)",
            "sInfoPostFix":  "",
            "sSearch":       "Buscar:",
            "sUrl":          "",
            "oPaginate": {
                "sFirst":    "Primero",
                "sPrevious": "Anterior",
                "sNext":     "Siguiente",
                "sLast":     "Último"
            }
        },
        initComplete: function () {
            this.api().columns([1,2,3]).every( function () {
                var column = this;
                var select = $('<select><option value=""></option></select>')
                    .appendTo( $(column.header()).empty() )
                    .on( 'change', function () {
                        var val = $.fn.dataTable.util.escapeRegex(
                            $(this).val()
                        );

                        column
                            .search( val ? '^'+val+'$' : '', true, false )
                            .draw();
                    } );

                column.data().unique().sort().each( function ( d, j ) {
                    select.append( '<option value="'+d+'">'+d+'</option>' )
                } );
            } );
        }});

});