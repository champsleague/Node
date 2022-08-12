// var v1 = 'v1'
// var v2 = 'v2'

var k = {
    v1:'v1a',
    v2:'v2',
    f1:function (){
        console.log(this.v1)
    },
    f2:function (){
        console.log(this.v2)
    }
}


k.f1();
k.f2();