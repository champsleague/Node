// array, object

var f = function(){
    console.log(1+1)
    console.log(1+2)
}

// JS에서는 function이라는 statement가 
// 다른 statement와는 다르게 값이 될 수 있다.

// JS에서 배열과 객체는 모두 서로 연관된 데이터를 
// 담는 그릇

// var i = if(true){console.log(1)};
// var w = while(true){console.log(1)};


var a = [f];
a[0]();

var o = {
    func:f
}
o.func()