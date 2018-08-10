var express = require('express');
var router = express.Router();
var fs = require('fs');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


/* POST handler. */
router.post('/', function (req, res, next) {
    var l_section = req.param('section');
    var l_tag = req.param('tag');
    var l_href = req.param('url');
    var l_added = req.param('added');
    var i = 'tag='+ l_tag + ', url=' + l_href + ', section=' + l_section + ', added=' + l_added;
    console.log(i);
    res.send(i);
    var db = null;
    db = JSON.parse(fs.readFileSync('/src/app/public/db/url.json', 'utf8'));
    // write file to JSON
    var i = parseInt(l_section);
    if(i < db.length) {
        console.log('DEBUG: Pushing : ' + db[i].name + ', # of urls: ' + db[i].urls.length);
        db[i].urls.push({
            "name": l_tag,
            "url": l_href,
            "added": l_added
        });
        console.log('DEBUG: pushed : ' + db[i].name + ', # of urls: ' + db[i].urls.length);
    }
    jsonData = JSON.stringify(db, null, 2);
    fs.writeFile('/src/app/public/db/url.json', jsonData, function (err) {
    if (err) 
      console.log(err);
  });  
});

module.exports = router;
