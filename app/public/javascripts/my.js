var target; //The element who opened the modal.

// add a new row to the table if there's no td left to add new links.
/*var newTableRow = '<tr><td class="tdOdd">';
newTableRow += '<a id="Section1" href="#" data-toggle="modal" data-target="#myModal">';
newTableRow + '<img src="/images/add.02.png"></a></td>';
for (var i = 0; i <=2; i++) {
    newTableRow += '<td class="tdEven"></td><td class="tdOdd"></td>';
}
newTableRow += '</tr>';*/

var addIcon = '<a id="__SECTION__" href="#" data-toggle="modal" data-target="#myModal"><img src="/images/add.02.png"></a>';
var newTableRow = ' <tr> \
                    <td class="tdOdd">__ADDICON__</td> \
                    <td class="tdEven"></td><td class="tdOdd"></td> \
                    <td class="tdEven"></td><td class="tdOdd"></td> \
                    <td class="tdEven"></td><td class="tdOdd"></td></tr>';

var newTableHead = '<table class="table">\
                    <thead>\
                    <tr>\
                    <th class="bg-primary text-center font-weight-bold text-white" scope="col" colspan="7">\
                        <a class="btn btn-primary" data-toggle="collapse" href="#collapse__SECTION__" role="button" \
                        aria-expanded="true" aria-controls="collapse__SECTION__">__SECTION__</a></th>\
                    </tr>\
                    </thead>\
                    <tbody class="collapse show" id="collapse__SECTION__"> \
                    <tr>';

const navItem = '<li class="nav-item">\
                <a class="flex-sm-fill text-sm-center nav-link" href="__NAV_URL__">\
                    __NAV_TAG__\
                </a>\
                </li>';
                    
$( document ).ready(function() {
    $.getJSON("/db/url.json", function(json) {
        console.log('DEBUG: 1st URL in the JSON: ' + json[0].urls[0].url)
        // populate the tables
        var str = '';
        for(var i = 0 ; i < json.length; i++) {
            if (json[i].type == 'nav') {
                var navStr = '';
                for (var m = 0; m < json[i].urls.length; m++) {
                    navStr += navItem.replace(/__NAV_URL__/, json[i].urls[m].url).replace(/__NAV_TAG__/, json[i].urls[m].name);
                }
                $('#navList').html(navStr);
                continue;
            }
            str += newTableHead.replace(/__SECTION__/g, json[i].name);
            for (var j = 0; j < json[i].urls.length; j++) {
                if ( (j % 7) % 2 == 0) {
                    str += '<td class="tdOdd"><a href="' + json[i].urls[j].url + '">' + json[i].urls[j].name + '</a></td>';
                } else {
                    str += '<td class="tdEven"><a href="' + json[i].urls[j].url + '">' + json[i].urls[j].name + '</a></td>';
                }
                if ( j % 7 == 6) {
                    str += '</tr>';
                }
            }
            var rem = (j-1) % 7;
            switch (rem) {
                case 6:
                    str += newTableRow.replace('__ADDICON__', addIcon.replace(/__SECTION__/g, json[i].name));
                    break;
                default:
                    for (var k = 0; k < 6-rem; k++) {
                        if ( (rem + k) % 2 == 1 ) {
                            if (k == 0) {
                                str += '<td class="tdOdd">' + addIcon.replace(/__SECTION__/g, json[i].name) + '</td>';
                            } else {
                                str += '<td class="tdOdd"></td>';
                            }
                        } else {
                            if (k == 0) {
                                str += '<td class="tdEven">' + addIcon.replace(/__SECTION__/g, json[i].name) + '</td>';
                            } else {
                                str += '<td class="tdEven"></td>';
                            }
                        }
                    }
                    str += '</tr>';
                    break;
            }
            str += '</tbody></table>';
            $('#tables').html(str);
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
                pElement.parentElement.parentElement.innerHTML += newTableRow.replace('__ADDICON__', addIcon.replace(/__SECTION__/g, sectionVal));
            }
            
            //hide the modal
            $('#myModal').modal('hide');
        }
    });
});