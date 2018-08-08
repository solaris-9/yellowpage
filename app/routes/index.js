var express = require('express');
var router = express.Router();
var fs = require('fs');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


/* POST handler. */
router.post('/', function (req, res, next) {
  var section = req.param('section');
  var tag = req.param('tag');
  var href = req.param('url');
  var added = req.param('added');
  var i = 'tag='+ tag + ', url=' + href + ', section=' + section + ', added=' + added;
  console.log(i);
  res.send(i);
  var db = null;
  db = JSON.parse(fs.readFileSync('/src/app/public/db/url.json', 'utf8'));
  // write file to JSON
  for(var i = 0 ; i < db.length; i++) {
    console.log('DEBUG: ' + db[i].name + ', # of urls: ' + db[i].urls.length);
    if (db[i].name.replace(/ /g, '') == section) {
        //console.log('DEBUG: found : ' + section + ' at pos: ' + i);
        db[i].urls.push({
            "name": tag,
            "url": href,
            "added": added
        });
        console.log('DEBUG: pushed : ' + section + ' at pos: ' + i);
        break;
    }
  }
  jsonData = JSON.stringify(db, null, 2);
    fs.writeFile('/src/app/public/db/url.json', jsonData, function (err) {
    if (err) 
      console.log(err);
  });  
});

module.exports = router;
