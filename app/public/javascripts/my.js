var g_target_id; //The id of the TD, in which the modal was opened

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
                <a class="btn btn-outline-__THEME__ text-sm-center nav-link font-weight-bold" \
                href="__NAV_URL__" target="_blank">__NAV_TAG__</a></li>';

// The template for table, tbody to be replaced             
const g_table = '<table class="table table-borderless">\
                    <thead><tr>\
                        <th scope="col" colspan="7">\
                            <a class="btn btn-__THEME__ btn-lg btn-block" \
                                data-toggle="collapse" \
                                href="#collapse__SECTION__" role="button" \
                                id="__SECTION__" \
                                aria-expanded="true" aria-controls="collapse__SECTION__">\
                                __SECTION__</a></th>\
                    </tr></thead>\
                    <tbody class="collapse show" id="collapse__SECTION__"> \
                    __ROWS__</tbody></table>';

// The template for table row, items to be replaced.
const g_trow = '<tr> \
                    <td class="tdOdd" id="R___ID_1__">__ITEM_1__</td>\
                    <td class="tdEven" id="R___ID_2__">__ITEM_2__</td>\
                    <td class="tdOdd" id="R___ID_3__">__ITEM_3__</td>\
                    <td class="tdEven" id="R___ID_4__">__ITEM_4__</td>\
                    <td class="tdOdd" id="R___ID_5__">__ITEM_5__</td>\
                    <td class="tdEven" id="R___ID_6__">__ITEM_6__</td>\
                    <td class="tdOdd" id="R___ID_7__">__ITEM_7__</td>\
                </tr>';

// The template for each item, theme/tag/url to be replaced
const g_item = '<a class="btn btn-outline-__THEME__ btn-block" \
                    href="__ITEM_URL__"  target="_blank">__ITEM_TAG__</a>';
                                    
// The template for the button to add new link, theme/section to be replaced
const g_add = '<a class="btn btn-outline-__THEME__ btn-block" \
                id="B___ID__" href="#" data-toggle="modal" \
                data-target="#myModal">\
                <img src="/images/add.02.png"></a>';

const g_toc = '<a class="btn btn-outline-__THEME__ \
            btn-block nav-link  font-weight-bold" href="#__SECTION__">__SECTION__</a>';
            
const g_column_per_row = 7;

const g_themes = [
    'primary',
    'primary',
    'secondary',
    'success',
    'info',
    'dark',
    'primary',
    'secondary',
    'success',
    'info',
    'dark'
];
                
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
                    navStr += g_nav.
                    replace(/__NAV_URL__/, json[i].urls[m].url).
                    replace(/__NAV_TAG__/, json[i].urls[m].name).
                    replace(/__THEME__/, g_themes[i]);
                }
                $('#navList').html(navStr);
                continue;
            }
            
            // The topics
            var l_topic_str = g_toc.replace(/__SECTION__/g, json[i].name).
                            replace(/__THEME__/, g_themes[i]);
            
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
                    var l_item_pattern = '__ITEM_' + (c+1) + '__';
                    var l_id = json[i].name + '_' + i + '_' + (r+1) + '_' + (c+1);
                    var l_id_pattern = '__ID_' + (c+1) + '__';
                    
                    l_row_str = l_row_str.replace(l_id_pattern, l_id);
                    
                    if(l_pos < json[i].urls.length) {
                        l_item = g_item.replace(/__ITEM_URL__/g, json[i].urls[l_pos].url).
                                        replace(/__ITEM_TAG__/g, json[i].urls[l_pos].name);
                        
                        l_row_str = l_row_str.replace(l_item_pattern, l_item);
                    } else if (l_pos == json[i].urls.length) {
                        l_row_str = l_row_str.replace(l_item_pattern, g_add.
                                                replace(/__ID__/, l_id));
                    } else {
                        l_row_str = l_row_str.replace(l_item_pattern, '');
                    }
                }
            }
            l_table_str = g_table.replace(/__ROWS__/g, l_row_str);
            l_table_str = l_table_str.replace(/__SECTION__/g, json[i].name).
                            replace(/__THEME__/g, g_themes[i]); 
                            //TODO: different table use different themes
            
            $('#tables')[0].innerHTML += l_table_str;
            $('#topics')[0].innerHTML += l_topic_str;
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
  g_target_id = event.relatedTarget.id // Button that triggered the modal
  console.log("DEBUG: The modal was called by: " + g_target_id)
  //var recipient = target.data('whatever') // Extract info from data-* attributes
  // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
  // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
  //var modal = $(this)
  //modal.find('.modal-title').text('New message to ' + recipient)
  //modal.find('.modal-body input').val(recipient)
})

$("input").keyup(function(event) {
    if(this.value.length > 0) {
        this.style.backgroundColor = 'transparent';
    } else {
        this.style.backgroundColor = 'pink';
    }
});

$("#form1").submit(function(e) {
    e.preventDefault();  
    var l_flag = false;
    var l_tag_val = $( "#tag-name" ).val();
    if(l_tag_val == '') {
        l_flag = true;
        $( "#tag-name" ).css("background-color", "pink");
    }
    var l_url_val = $( "#url-name" ).val();
    if(l_url_val == '') {
        l_flag = true;
        $( "#url-name" ).css("background-color", "pink");
    }
    var l_added_by = $( "#added-name" ).val();
    if(l_added_by == '') {
        l_flag = true;
        $( "#added-name" ).css("background-color", "pink");
    }
    if (l_flag) {
        return;
    }
    // example: B_Section-1_1_3_2
    /* l_parts_from_id[1]: the name of the section, 
     *         important to find the correct entry in url.json
     * l_parts_from_id[2]: the sequence id of the section
     *l_parts_from_id[3]: the row of the table
     *l_parts_from_id[4]: the column of the table
    */
    var l_parts_from_id = g_target_id.split('_');
    
    console.log('DEBUG: Tag Value = ' + l_tag_val);
    console.log('DEBUG: Parts from ID = ' + l_parts_from_id[1] + ', ' + 
                    l_parts_from_id[2] + ', ' + l_parts_from_id[3]  + 
                    ', ' + l_parts_from_id[4]);
    //var pElement = target[0].parentElement; //td
    //var addIconHtml = pElement.innerHTML;
    //var sectionVal = target[0].id;
    //console.log('DEBUG: parent.innerHTML: ' + addIconHtml);
    $.ajax({
        url: '/',
        type: 'POST',
        data: {
            section: l_parts_from_id[1],
            tag: l_tag_val,
            url: l_url_val,
            added: l_added_by
        },
        success: function (data) {
            console.log('DEBUG: feedback from server: ' + data);
            
            // render the new link in current cell.
            $('#' + g_target_id.replace(/B_/, 'R_')).html(g_item.
                                        replace(/__ITEM_URL__/, l_url_val).
                                        replace(/__ITEM_TAG__/, l_tag_val).
                                        replace(/__THEME__/g, g_themes[l_parts_from_id[2]]));
                                        
            if(parseInt(l_parts_from_id[4]) == g_column_per_row){
                // A new row must be added.
                // 1st item of the new row is the add icon
                var l_new_id = l_parts_from_id[1] + '_' + l_parts_from_id[2] + '_' +
                                (parseInt(l_parts_from_id[3]) + 1) + '_' + '1';
                var l_new_row = g_trow.replace(/__ITEM_1__/, g_add).
                            replace(/__ID__/, l_new_id).
                            replace(/__ID_1__/, l_new_id).
                            replace(/__ITEM_\d__/g, '').
                            replace(/__THEME__/g, g_themes[l_parts_from_id[2]]);  
                            //TODO: different table use different themes
                            
                for(var i = 2; i <= g_column_per_row; i++) {
                    /*var l_new_id = l_parts_from_id[1] + '_' + 
                                (parseInt(l_parts_from_id[2]) + 1) + '_' + '1';*/
                    var l_id_pattern = '__ID_' + i + '__';
                    var l_id = l_parts_from_id[1] + '_' + l_parts_from_id[2] + '_' +
                                (parseInt(l_parts_from_id[3]) + 1) + '_' + i;
                    l_new_row = l_new_row.replace(l_id_pattern, l_id);
                }
                
                $('#collapse' + l_parts_from_id[1])[0].innerHTML += l_new_row;
            } else {
                // In current cell: render url & tab
                // In next cell: render a addIcon
                var l_new_id = l_parts_from_id[1] + '_' + l_parts_from_id[2] + '_' +
                                l_parts_from_id[3] + '_' + 
                                (parseInt(l_parts_from_id[4]) + 1);
                                
                $('#R_'+l_new_id).html(g_add.replace(/__ID__/, l_new_id).
                                        replace(/__THEME__/g, g_themes[l_parts_from_id[2]]));
            }
            /*if(pElement.nextSibling) {
                pElement.nextElementSibling.innerHTML = addIconHtml;
            } else {
                // TODO: add a new table row
                // td -> tr -> tbody
                pElement.parentElement.parentElement.innerHTML += 
                    g_trow.replace('__ADDICON__', 
                        g_add.replace(/__SECTION__/g, sectionVal).
                            replace(/__THEME__/g, 'primary'));
            }*/
            
            //hide the modal
            $('#myModal').modal('hide');
        }
    });
});