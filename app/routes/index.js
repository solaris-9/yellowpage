var express = require('express');
var router = express.Router();
var fs = require('fs');
var db = require('/src/app/public/db/url.json');

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
  // write file to JSON
  for(var i = 0 ; i < db.length; i++) {
    if (db[i].name == section) {
        //console.log('DEBUG: found : ' + section + ' at pos: ' + i);
        db[i].urls.push({
            "name": tag,
            "url": href,
            "added": added
        });
        console.log('DEBUG: pushed : ' + section + ' at pos: ' + i);
    }
  }
  jsonData = JSON.stringify(db, null, 2);
  console.log('DEBUG: ' + jsonData);
  fs.writeFile('/src/app/public/db/url.json', jsonData, function (err) {
    if (err) 
      console.log(err);
  });  
});

module.exports = router;
