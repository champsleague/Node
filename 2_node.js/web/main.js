var http = require('http');
var fs = require('fs');
var url = require('url');

function templateHTML(title,list,body){
  return `
          <!doctype html>
          <html>
          <head>
          <title>WEB1 - ${title}</title>
          <meta charset="utf-8">
          </head>
          <body>
          <h1><a href="/">WEB</a></h1>
          ${list}
          <a href="/create">create</a>
          ${body}
          </body>
          </html>
  `
}
function templateList(filelist){
    var list = '<ul>'
    var i=0;
    while(i<filelist.length){
    list = list+ `<li> <a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`
    i+=1;
    }
    list = list+'</ul>'
    return list
}


var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url,true).query;
    var pathname = url.parse(_url,true).pathname;
    if(pathname === '/'){
        if(queryData.id===undefined){
         
          // fs.readFile(`../data/${queryData.id}`,'utf-8',function(err,description){
           
          fs.readdir('../data',function(error,filelist){
              console.log(filelist)

          var title = 'welcome';
          var description = 'hello node'

          // var list = <ul>
          // <li><a href="/?id=HTML">HTML</a></li>
          // <li><a href="/?id=CSS">CSS</a></li>
          // <li><a href="/?id=JS">JavaScript</a></li>
          // </ul>



          //var list = '<ul>'
          // var i=0;
          // while(i<filelist.length){
          //   list = list+ `<li> <a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`
          //   i+=1;
          // }
          // list = list+'</ul>'

          var list = templateList(filelist)
          var template = templateHTML(title,list,`<h2>${title}</h2>${description}`);

          response.writeHead(200);
          response.end(template);
          })
          
          
          // })
        }


        else{
          fs.readdir('../data',function(error,filelist){
            console.log(filelist)
       
          fs.readFile(`../data/${queryData.id}`,'utf-8',function(err,description){
            var title = queryData.id;
            var list = templateList(filelist)
            var template = templateHTML(title,list,`<h2>${title}</h2>${description}`);

          response.writeHead(200);
          response.end(template);
          })
        })
      }
  
     } 
     else if(pathname==="/create"){
      fs.readdir('../data',function(error,filelist){
        var title = 'web-create';
        var list = templateList(filelist)
        var template = templateHTML(title,list,
          `
          <form action="http://localhost:3000/process_create" method="post">
          <p><input type="text" name="title" placeholder="title"></p>
          <p>
            <textarea name="description" placeholder="description"></textarea>
          </p>
          <p>
            <input type="submit">
          </p>
        </form>          
        `);

      response.writeHead(200);
      response.end(template);
     })
    }
  
     else{
      response.writeHead(404);
      response.end('not found');
    }


});
app.listen(3000);