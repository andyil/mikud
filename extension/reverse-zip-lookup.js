$(function()
{

    function add_ui()
    {
        let elem = $('.form-title');
        $('.form-title').html('חיפוש כתובות גולמי (תוסף פעיל)');
        $('label').html('הזן מיקודים ב-7 ספרות מופרדים עם פסיקים. הזן טווחים באמצעות מקף');


        $('#Zip777').removeAttr('maxlength');
        $('#Zip777').val('6407504-6407517,2244640-2244740');
        $('#AddressSearchByZipSearch').removeAttr('onclick');
        $('#AddressSearchByZipSearch').unbind();
        $('#AddressSearchByZipSearch').off();
        $('#AddressSearchByZipSearch').html('חיפוש גולמי')

        var old = document.getElementById("AddressSearchByZipSearch");
        var repl = old.cloneNode(true);
        old.parentNode.replaceChild(repl, old);

        $('#AddressSearchByZipSearch').click(function(e)
        {
            e.preventDefault();
            $('#AddressSearchByZipSearch').attr('disabled', '1');
            document.queue = [];
            document.pending = 0;
            document.not_found = 0;
            let inp = $('#Zip777').val()
            let parts = inp.split(',');
             $("#searchresult").html('');
             $("#searchresult").slideDown();
            for(let i=0; i < parts.length; i++)
            {
                let part = parts[i].trim();
                if (part.indexOf('-') > 0)
                {
                    let range_parts = part.split('-');
                    let from = range_parts[0];
                    let to = range_parts[1];
                    for(let j=Math.min(from, to); j <= Math.max(from, to); j++)
                    {
                        document.queue.push(j);
                    }
                }
                else
                {
                        docuement.queue.push(j);
                }
            }
            write_pending();
            $("#searchresult").append(`מחפש ${document.queue.length} מיקודים<br/>`)
            send_small_batch();
        });

    }

    function write_pending()
    {
        let button =  $('#AddressSearchByZipSearch');
        if (document.queue.length > 0)
        {
            button.html(`מחפש ${document.queue.length} מיקודים`);
        }
        else
        {
            button.removeAttr('disabled');
            button.html('חיפוש גולמי')
        }

    }

    function send_small_batch()
    {
        while(document.pending <= 4 && document.queue.length > 0)
        {
            let next = document.queue.pop();
            my_query(next);
        }
    }

     function my_query(zip7)
    {
        var model = {
                Zipcode: zip7,
                __RequestVerificationToken: $('[name=__RequestVerificationToken]').val()
            }
        document.pending ++;
        $.ajax({
                url: 'https://mypost.israelpost.co.il/umbraco/Surface/Zip/FindAddressbyZip',
                method: "POST",
                data: model
            }).done(function(d){
                var m = d['message'];
                const not_found='המיקוד לא נמצא';
                if (m != not_found)
                {
                    $("#searchresult").append(`${zip7} ${m}<br/>`);
                }
                else
                {
                    document.not_found++;
                }
                document.pending--;
                if (document.queue.length > 0)
                {
                    send_small_batch();
                }

                write_pending();

                if (document.queue.length == 0 && document.pending == 0)
                {
                    $("#searchresult").append(`החיפוש הסתיים, ${document.not_found} מיקודים לא אותרו<br/>`);
                }
            });
    }


    add_ui();


})