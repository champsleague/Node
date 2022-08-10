// function a(){
//     console.log('A')
// }

var a = function(){
    console.log('B')
}
a()

function slowfunc(callback){
    callback()
}
slowfunc(a)