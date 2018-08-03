var target; //The element who opened the modal.

// add a new row to the table if there's no td left to add new links.
/*var newTableRow = '<tr><td class="tdOdd">';
newTableRow += '<a id="Section1" href="#" data-toggle="modal" data-target="#myModal">';
newTableRow + '<img src="/images/add.02.png"></a></td>';
for (var i = 0; i <=2; i++) {
    newTableRow += '<td class="tdEven"></td><td class="tdOdd"></td>';
}
newTableRow += '</tr>';*/

// The navbar items, theme/tag/url to be replaced
const g_nav = '<li class="nav-item">\
                <a class="btn btn-outline-__THEME__ btn-lg text-sm-center nav-link" \
                href="__NAV_URL__">__NAV_TAG__</a></li>';

// The template for table, tbody to be replaced             
const g_table = '<table class="table table-borderless">\
                    <thead><tr>\
                        <th scope="col" colspan="7">\
                            <a class="btn btn-__THEME__ btn-lg btn-block" \
                                data-toggle="collapse" \
                                href="#collapse__SECTION__" role="button" \
                                aria-expanded="true" aria-controls="collapse__SECTION__">\
                                __SECTION__</a></th>\
                    </tr></thead>\
                    <tbody class="collapse show" id="collapse__SECTION__"> \
                    __ROWS__</tbody></table>';

// The template for table row, items to be replaced.
const g_trow = '<tr> \
                    <td class="tdOdd">__ITEM_1__</td>\
                    <td class="tdEven">__ITEM_2__</td>\
                    <td class="tdOdd">__ITEM_3__</td>\
                    <td class="tdEven">__ITEM_4__</td>\
                    <td class="tdOdd">__ITEM_5__</td>\
                    <td class="tdEven">__ITEM_6__</td>\
                    <td class="tdOdd">__ITEM_7__</td>\
                </tr>';

// The template for each item, theme/tag/url to be replaced
const g_item = '<a class="btn btn-outline-__THEME__ btn-block" \
                    href="__ITEM_URL__">__ITEM_TAG__</a>';
                                    
// The template for the button to add new link, theme/section to be replaced
const g_add = '<a class="btn btn-outline-__THEME__ btn-lg btn-block" \
                id="__SECTION__" href="#" data-toggle="modal" \
                data-target="#myModal">\
                <img src="/images/add.02.png"></a>';

const g_column_per_row = 7;
                
$( document ).ready(function() {
    $.getJSON("/db/url.json", function(json) {
        console.log('DEBUG: 1st URL in the JSON: ' + json[0].urls[0].url)
        // string to store html for tables.
        var l_table_str = '';
        for(var i = 0 ; i < json.length; i++) {
            /* Navbar populating */
            if (json[i].type == 'nav') {
                var navStr = '';
                for (var m = 0; m < json[i].urls.length; m++) {
                    navStr += g_nav.replace(/__NAV_URL__/, 
                        json[i].urls[m].url).replace(/__NAV_TAG__/, 
                        json[i].urls[m].name);
                }
                $('#navList').html(navStr);
                continue;
            }
            
            // populating the single table
            // caculate how many rows will be in each table
            var l_row_number = parseInt(json[i].urls.length / g_column_per_row) + 1;
            /*if(json[i].urls.length % g_column_per_row > 0) {
                l_row_number += 1;
            }*/
            var l_row_str = '';
            for(var r=0; r < l_row_number; r++) {
                l_row_str += g_trow;
                for(var c=0; c<g_column_per_row; c++){
                    var l_pos = r * g_column_per_row + c;
                    l_item_patterm = '__ITEM_' + (c+1) + '__';
                    if(l_pos < json[i].urls.length) {
                        l_item = g_item.replace(/__ITEM_URL__/g, json[i].urls[l_pos].url).
                                        replace(/__ITEM_TAG__/g, json[i].urls[l_pos].name);
                        
                        l_row_str = l_row_str.replace(l_item_patterm, l_item);
                    } else if (l_pos == json[i].urls.length) {
                        l_row_str = l_row_str.replace(l_item_patterm, g_add);
                    } else {
                        l_row_str = l_row_str.replace(l_item_patterm, '');
                    }
                }
            }
            l_table_str = g_table.replace(/__ROWS__/g, l_row_str);
            l_table_str = l_table_str.replace(/__SECTION__/g, json[i].name).
                            replace(/__THEME__/g, 'primary'); //TODO: different table use different themes
            
            $('#tables')[0].innerHTML += l_table_str;
/*            str += g_thead.replace(/__SECTION__/g, json[i].name);
            for (var j = 0; j < json[i].urls.length; j++) {
                if ( (j % 7) % 2 == 0) {
                    str += '<td class="tdOdd"><a class="btn btn-outline-primary btn-block" href="' + json[i].urls[j].url + '">' + json[i].urls[j].name + '</a></td>';
                } else {
                    str += '<td class="tdEven"><a class="btn btn-outline-success btn-block" href="' + json[i].urls[j].url + '">' + json[i].urls[j].name + '</a></td>';
                }
                if ( j % 7 == 6) {
                    str += '</tr>';
                }
            }
            var rem = (j-1) % 7;
            switch (rem) {
                case 6:
                    str += g_trow.replace('__ADDICON__', g_add.
                            replace(/__SECTION__/g, json[i].name).
                            replace(/__THEME__/g, 'primary'));
                    break;
                default:
                    for (var k = 0; k < 6-rem; k++) {
                        if ( (rem + k) % 2 == 1 ) {
                            if (k == 0) {
                                str += '<td class="tdOdd">' + 
                                    g_add.replace(/__SECTION__/g, json[i].name).
                                            replace(/__THEME__/g, 'primary') + '</td>';
                            } else {
                                str += '<td class="tdOdd"></td>';
                            }
                        } else {
                            if (k == 0) {
                                str += '<td class="tdEven">' + 
                                    g_add.replace(/__SECTION__/g, json[i].name).
                                            replace(/__THEME__/g, 'primary')  + '</td>';
                            } else {
                                str += '<td class="tdEven"></td>';
                            }
                        }
                    }
                    str += '</tr>';
                    break;
            }
            str += '</tbody></table>';
            $('#tables').html(str);*/
        }
    });
    console.log("DEBUB: The page is loaded"); 
});


$('#myModal').on('show.bs.modal', function (event) {
  //console.log('modal is shown')
  target = $(event.relatedTarget) // Button that triggered the modal
  console.log("DEBUG: The modal was called by: " + target[0].id)
  //var recipient = target.data('whatever') // Extract info from data-* attributes
  // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
  // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
  //var modal = $(this)
  //modal.find('.modal-title').text('New message to ' + recipient)
  //modal.find('.modal-body input').val(recipient)
})

$("#form1").submit(function(e) {
    e.preventDefault();    
    var tagVal = $( "#tag-name" ).val();
    var urlVal = $( "#url-name" ).val();
    var addedVal = $( "#added-name" ).val();
    console.log('DEBUG: Tag Value = ' + tagVal);
    var pElement = target[0].parentElement; //td
    var addIconHtml = pElement.innerHTML;
    var sectionVal = target[0].id;
    console.log('DEBUG: parent.innerHTML: ' + addIconHtml);
    $.ajax({
        url: '/',
        type: 'POST',
        data: {
            section: sectionVal,
            tag: tagVal,
            url: urlVal,
            added: addedVal
        },
        success: function (data) {
            console.log('DEBUG: feedback from server: ' + data);
            //TODO: add the new link
            
            pElement.innerHTML = '<a href="' + urlVal + '">' + tagVal + '</a>';
            //TODO: move add icon to next sibling
            if(pElement.nextSibling) {
                pElement.nextElementSibling.innerHTML = addIconHtml;
            } else {
                // TODO: add a new table row
                // td -> tr -> tbody
                pElement.parentElement.parentElement.innerHTML += 
                    g_trow.replace('__ADDICON__', 
                        g_add.replace(/__SECTION__/g, sectionVal).
                            replace(/__THEME__/g, 'primary'));
            }
            
            //hide the modal
            $('#myModal').modal('hide');
        }
    });
});