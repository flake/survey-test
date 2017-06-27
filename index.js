/**
 * @Author: Rajasekhar Reddi <flake>
 * @Date:   2017-06-24T01:25:22+05:30
 * @Email:  me@rajasekhar.in
 * @Last modified by:   flake
 * @Last modified time: 2017-06-27T19:22:16+05:30
 */



const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const MongoClient = require('mongodb').MongoClient;
var db;
var sourceURL;
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function(req, res) {
  sourceURL = req.query.rurl;
  res.sendFile(__dirname + '/index.html');
});

app.post('/survey', (req, res) => {
  req.body.age = parseInt(req.body.age);
  req.body.experience = parseInt(req.body.experience);
  db.collection('records').save(req.body, (err, result) => {
    if (err) return console.log(err);

    res.redirect('/thankyou');
  });
});

app.get('/reports', (req, res) => {
  var records = {};
  db.collection('records').count().then((count) => {
    records.total = count;
    db.collection('records').aggregate([{
      $project: {
        male: {$cond: [{$eq: ["$gender", "male"]}, 1, 0]},
        female: {$cond: [{$eq: ["$gender", "female"]}, 1, 0]},
        age: 1,
        experience: 1
      }}, {
      $group: {
        _id: null,
        male: {$sum: "$male"},
        female: {$sum: "$female"},
        avg_age: {$avg: "$age"},
        avg_rating: {$avg: "$experience"}}}])
    .get((err, result) => {
      records.avg_age = result[0].avg_age;
      records.avg_rating = result[0].avg_rating;
      records.gender = [{male: result[0].male, female: result[0].female}];
      console.log("gender data ", records.gender);
      res.render('reports.ejs', {reports: records});
    });
  });
});

app.get('/thankyou', function(req, res) {
  res.render('thanks.ejs', {sourceURL: sourceURL});
});

app.get('/linkpage', function(req, res){
  res.sendFile(__dirname + '/linkpage.html');
});

app.get('/:url', function(req, res) {
  res.send('the url val ' + req.params.url);
});

MongoClient.connect('mongodb://raj:survey@ds139072.mlab.com:39072/survey', (err, database) => {
  if (err) return console.log(err);

  db = database;
  app.listen(3000, () => {
    console.log('server listening on 3000');
  })
});
