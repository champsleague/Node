var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring')

var template = require('../lib/template.js')
var sanitizeHtml = require('sanitize-html')

// refactoring



function templateHTML(title,list,body,control){
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
          ${control}
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

          // var list = templateList(filelist)
          // var template = templateHTML(title,list,
          //   `<h2>${title}</h2>${description}`,
          //   `<a href="/create">create</a>`
          //   );
          // response.writeHead(200);
          // response.end(template);





          var list = template.list(filelist)
          var html = template.HTML(title,list,
            `<h2>${title}</h2>${description}`,
            `<a href="/create">create</a>`
            );
          response.writeHead(200);
          response.end(html);

          })

          
          // })
        }


        else{
          fs.readdir('../data',function(error,filelist){
            console.log(filelist)
       
          fs.readFile(`../data/${queryData.id}`,'utf-8',function(err,description){
            var title = queryData.id;
            var sanitizedTitle = sanitizeHtml(title);
            var sanitizedDescription = sanitizeHtml(description);
            var list = template.list(filelist)
            var html = template.HTML(sanitizedTitle,list,
              `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`,
              `<a href="/create">create</a> 
               <a href="/update?id=${sanitizedTitle}">update</a>

               <form action="delete_process" method="post">
               <input type="hidden" name="id" value="${sanitizedTitle}">
               <input type="submit" value="delete">
               </form>
              `
              );

          response.writeHead(200);
          response.end(html);
          })
        })
      }
     } 

    //  create
     else if(pathname==="/create"){
      fs.readdir('../data',function(error,filelist){
        var title = 'web-create';
        var list = template.list(filelist)
        var html = template.HTML(title,list,
          `
          <form action="/create_process" method="post">
          <p><input type="text" name="title" placeholder="title"></p>
          <p>
            <textarea name="description" placeholder="description"></textarea>
          </p>
          <p>
            <input type="submit">
          </p>
        </form>          
        `,'');

      response.writeHead(200);
      response.end(html);
     })
    }else if(pathname==='/create_process'){
      var body = ''
      request.on('data',function(data){
        body +=data;
      })
      request.on('end',function(){
        var post = qs.parse(body)
        var title = post.title
        var description = post.description
        
        fs.writeFile(`../data/${title}`,description,'utf-8',function(err){
          response.writeHead(302,{Location: `/?id=${title}`});
          // port 302 : redirection
          response.end();
        })
      })
    }

    // update
    else if(pathname==='/update'){
      fs.readdir('../data',function(error,filelist){
        console.log(filelist)
   
      fs.readFile(`../data/${queryData.id}`,'utf-8',function(err,description){
        var title = queryData.id;
        var list = template.list(filelist)
        var html = template.HTML(title,list,
          `
          <form action="/update_process" method="post">
      <input type = "hidden" name="id" value="${title}"

          <p><input type="text" name="title" placeholder="title" value="${title}"></p>
          <p>
            <textarea name="description" placeholder="description">${description}</textarea>
          </p>
          <p>
            <input type="submit">
          </p>
        </form> 
          `,
          `<a href="/create">create</a> 
          <a href="/update?id=${title}">update</a>`
          );

      response.writeHead(200);
      response.end(html);
      })
    })
    }

    // update_process
    else if(pathname==='/update_process'){
      var body = ''
      request.on('data',function(data){
        body +=data;
      })
      request.on('end',function(){
        var post = qs.parse(body)
        var id = post.id
        var title = post.title
        var description = post.description
        fs.rename(`../data/${id}`,`../data/${title}`,function(err){
          fs.writeFile(`../data/${title}`,description,'utf-8',function(err){
            response.writeHead(302,{Location: `/?id=${title}`});
            // port 302 : redirection
            response.end();
          })
        })
      })
    }

    // delete_process
    else if(pathname==='/delete_process'){
      var body = ''
      request.on('data',function(data){
        body +=data;
      })
      request.on('end',function(){
        var post = qs.parse(body)
        var id = post.id
        fs.unlink(`../data/${id}`,function(err){
          response.writeHead(302,{Location: `/`});
          // port 302 : redirection
          response.end();
        })
      })
    }
  
     else{
      response.writeHead(404);
      response.end('not found');
    }


});
app.listen(3000);