// function a(){
//     console.log('A')
// }

const { listenerCount } = require("process")

var a = function(){
    console.log('B')
}
a()

function slowfunc(callback){
    callback()
}
slowfunc(a)


// npm install pm2 -g
// pm2 list  
// pm2 monit 
// pm2 start main.js