var express = require('express')
var router = express.Router();
var template = require('./lib/template.js')


router.get('/',function(request,response) {
    fs.readdir('./data', function(error, filelist){
        var title = 'Welcome';
        var description = 'Hello, Node.js';
        var list = template.list(request.list);
        var html = template.HTML(title, list,
          `<h2>${title}</h2>${description}
          <img src="/img/paris.jpg" style="width:500px; display:block;">`
          ,
          `<a href="/create">create</a>`
        );
        response.send(html);
      });
    })

module.exports = router;