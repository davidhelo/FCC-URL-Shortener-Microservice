require('dotenv').config();
const express = require('express');
const cors = require('cors');
const dns = require('dns');
const bodyParser = require('body-parser');

const app = express();

let shorturlIndex = 0;
let shorturlIndexes = [];

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.use('/api/shorturl', bodyParser.urlencoded({extended: false}));

function URL_FORM_HANDLER(req, res) {
  dns.lookup(req.body.url.replace(/^http[s]?:\/\/www./ig, ''), (error, addresses, family) => {
    if (error != null) {
      res.json({ error: 'invalid url' });
    } else {
      shorturlIndex += 1;
      shorturlIndexes.push({ 
        "original_url": req.body.url,
        "short_url": shorturlIndex
      });
      res.json(shorturlIndexes[shorturlIndexes.length - 1]);
    }
  });
}

app.post('/api/shorturl', URL_FORM_HANDLER);

app.get('/api/shorturl/:shorturl', function (req, res) {
  let shorturl_Requested = parseInt(req.params.shorturl);
  res.redirect(shorturlIndexes[shorturl_Requested - 1].original_url);
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
