var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/download', function(req, res, next) {
  const file = './test.txt';
  res.setHeader('Content-type', 'application/octet-stream');
  res.download('./test.txt', 'test.txt');
});

module.exports = router;
