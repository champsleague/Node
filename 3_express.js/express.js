var express = require('express')
var app = express()
var fs = require("fs")
var path = require('path')
var sanitizeHtml = require('sanitize-html')
var bodyparser = require('body-parser')
var compression = require('compression')
var topicRouter = require('./routes/topic')
var indexRouter = require('./routes/index')
// var template = require('./lib/template.js')


app.use(express.static('public'))
app.use(bodyparser.urlencoded ({extended:false}))
app.use(compression())
app.get('*',function(request,response,next){
    fs.readdir('./data', function(error, filelist){
        request.list = filelist;
        next()
    })
})
app.use('/',indexRouter)
app.use('/topic',topicRouter)








// route, routing
// app.get('/',(req,res)=> res.send('hi'))
app.get('/',function(request,response) {
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



app.get('/page/:pageId',function(request,response,next) {
    fs.readdir('./data', function(error, filelist){
        var filteredId = path.parse(request.params.pageId).base;
        fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){

        if(err){
            next(err)
           
        }else{
            var title = request.params.pageId;
            var sanitizedTitle = sanitizeHtml(title);
            var sanitizedDescription = sanitizeHtml(description, {
              allowedTags:['h1']
            });
            var list = template.list(request.list);
            var html = template.HTML(sanitizedTitle, list,
              `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`,
              ` <a href="/create">create</a>
                <a href="/update/${sanitizedTitle}">update</a>
                <form action="/delete_process" method="post">
                  <input type="hidden" name="id" value="${sanitizedTitle}">
                  <input type="submit" value="delete">
                </form>`
            );
            response.send(html);
        }     
         
      });
    })
})


// CREATE
app.get('/create',function(request,response){
    fs.readdir('./data', function(error, filelist){
        var title = 'WEB - create';
        var list = template.list(request.list);
        var html = template.HTML(title, list, `
          <form action="/create_process" method="post">
            <p><input type="text" name="title" placeholder="title"></p>
            <p>
              <textarea name="description" placeholder="description"></textarea>
            </p>
            <p>
              <input type="submit">
            </p>
          </form>
        `, '');
        response.send(html);
      });
}) 


app.post('/create_process',function(request,response){
    // var body = '';
    // request.on('data', function(data){
    //     body = body + data;
    // });
    // request.on('end', function(){
    //     var post = qs.parse(body);
    //     var id = post.id;
    //     var title = post.title;
    //     var description = post.description;
    //     fs.rename(`data/${id}`, `data/${title}`, function(error){
    //       fs.writeFile(`data/${title}`, description, 'utf8', function(err){
    //         response.writeHead(302, {Location: `/?id=${title}`});
    //         response.end();
    //       })
    //     });
    // });

        var post = request.body;
        var title = post.title;
        var description = post.description;
          fs.writeFile(`data/${title}`, description, 'utf8', function(err){
            response.writeHead(302, {Location: `/?id=${title}`});
            response.end();
          })
        });
    





// UPDATE

app.get('/update/:pageId',function(request,response){
    fs.readdir('./data', function(error, filelist){
        var filteredId = path.parse(request.params.pageId).base;
        fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
          var title = request.params.pageId;
          var list = template.list(request.list);
          var html = template.HTML(title, list,
            `
            <form action="/update_process" method="post">
              <input type="hidden" name="id" value="${title}">
              <p><input type="text" name="title" placeholder="title" value="${title}"></p>
              <p>
                <textarea name="description" placeholder="description">${description}</textarea>
              </p>
              <p>
                <input type="submit">
              </p>
            </form>
            `,
            `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`
          );
          response.send(html);
        });
      });
})

app.post('/update_process',function(request,response){
          var post = request.body;
          var id = post.id;
          var title = post.title;
          var description = post.description;
          fs.rename(`data/${id}`, `data/${title}`, function(error){
            fs.writeFile(`data/${title}`, description, 'utf8', function(err){
              response.redirect('/?id=${title}')
            })
          });
})


// DELETE
app.post('/delete_process',function(request,response){
    var post = request.body;
    var id = post.id;
    var filteredId = path.parse(id).base;
    fs.unlink(`data/${filteredId}`, function(error){
      response.redirect('/');
            })
          });


app.use(function(req,res,next){
    res.status(404).send("sorry, not found")
})


app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something broke!')
  })


app.listen(3000,function(){
console.log("app listening on port 3000")
})
