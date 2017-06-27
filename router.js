/**
 * @Author: Rajasekhar Reddi <flake>
 * @Date:   2017-06-24T01:32:43+05:30
 * @Email:  me@rajasekhar.in
 * @Last modified by:   flake
 * @Last modified time: 2017-06-24T01:34:31+05:30
 */



var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.send('GET route on router');
});
router.post('/', function(req, res) {
  res.send('POST route on router');
});

module.exports = router;
