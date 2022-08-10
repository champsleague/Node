var members=['cr7','sr4','pm3']
console.log(members[1])

var i = 0;
while(i<members.length){
    console.log('arr loop',members[i])
    i+=1;
}

var nationality = {
    'portugal' : 'cr7',
    'spain' : 'sr4',
    'italy' : 'pm3'
}
console.log(nationality.portugal)


for(var object in nationality){
    console.log('\nnationality =>',object,
    '\nvalue=>',nationality[object])
}